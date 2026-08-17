import type { Request, Response, NextFunction, RequestHandler } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { db, usersTable, type User } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

export interface AuthedRequest extends Request {
  authUser?: User;
}

function adminEmailAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function provisionUser(clerkUserId: string): Promise<User> {
  let email: string | null = null;
  let firstName: string | null = null;
  let lastName: string | null = null;
  let imageUrl: string | null = null;

  try {
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    email =
      clerkUser.primaryEmailAddress?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress ??
      null;
    firstName = clerkUser.firstName ?? null;
    lastName = clerkUser.lastName ?? null;
    imageUrl = clerkUser.imageUrl ?? null;
  } catch {
    // Provision with minimal info if the Clerk lookup fails.
  }

  const isAllowlisted = Boolean(
    email && adminEmailAllowlist().includes(email.toLowerCase()),
  );

  // Role resolution: explicit allowlist wins; otherwise the very first user to
  // sign up bootstraps as admin so the owner always has dashboard access.
  // The zero-admin check + insert run inside a transaction guarded by a
  // Postgres advisory lock so concurrent first signups cannot both become admin.
  const ADMIN_BOOTSTRAP_LOCK = 427819;

  const user = await db.transaction(async (tx) => {
    let role: "user" | "admin" = "user";

    if (isAllowlisted) {
      role = "admin";
    } else {
      await tx.execute(sql`select pg_advisory_xact_lock(${ADMIN_BOOTSTRAP_LOCK})`);
      const [row] = await tx
        .select({ count: sql<number>`count(*)::int` })
        .from(usersTable)
        .where(eq(usersTable.role, "admin"));
      if (!row || row.count === 0) role = "admin";
    }

    const [inserted] = await tx
      .insert(usersTable)
      .values({ clerkUserId, email, firstName, lastName, imageUrl, role })
      .onConflictDoUpdate({
        target: usersTable.clerkUserId,
        set: { email, firstName, lastName, imageUrl },
      })
      .returning();

    return inserted;
  });

  return user;
}

export async function getOrCreateUser(clerkUserId: string): Promise<User> {
  const existing = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkUserId, clerkUserId),
  });
  if (existing) {
    // The allowlist is normally consulted only at first provision. If an
    // already-provisioned account is later added to ADMIN_EMAILS, promote it on
    // its next request so the owner can grant admin without a manual DB edit.
    const allowlisted = Boolean(
      existing.email &&
        adminEmailAllowlist().includes(existing.email.toLowerCase()),
    );
    if (allowlisted && existing.role !== "admin") {
      const [promoted] = await db
        .update(usersTable)
        .set({ role: "admin" })
        .where(eq(usersTable.id, existing.id))
        .returning();
      return promoted ?? existing;
    }
    return existing;
  }
  return provisionUser(clerkUserId);
}

export function requireAuth(): RequestHandler {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    const auth = getAuth(req);
    const userId = auth?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      req.authUser = await getOrCreateUser(userId);
      next();
    } catch (err) {
      req.log.error({ err }, "Failed to provision user");
      res.status(500).json({ error: "Failed to load user" });
    }
  };
}

export function requireAdmin(): RequestHandler {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.authUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (req.authUser.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}

/**
 * Allows staff OR admin. Used for pipeline-management reads/writes that the
 * owner wants to delegate to staff (reviewing applications, leaving notes,
 * advancing the enrollment funnel) while keeping role changes admin-only.
 */
export function requireStaff(): RequestHandler {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.authUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (req.authUser.role !== "admin" && req.authUser.role !== "staff") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}
