import { Router, type IRouter, type Response } from "express";
import {
  UpdateApplicationStatusBody,
  CreateApplicationNoteBody,
  UpdateUserRoleBody,
} from "@workspace/api-zod";
import {
  db,
  applicationsTable,
  applicationNotesTable,
  usersTable,
  contactMessagesTable,
} from "@workspace/db";
import { desc, eq, sql } from "drizzle-orm";
import {
  requireAuth,
  requireAdmin,
  requireStaff,
  type AuthedRequest,
} from "../lib/auth";

const router: IRouter = Router();

function displayName(user: {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}): string | null {
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return full || user.email || null;
}

// ---------------------------------------------------------------------------
// Applications pipeline (staff + admin)
// ---------------------------------------------------------------------------

router.get(
  "/admin/applications",
  requireAuth(),
  requireStaff(),
  async (_req: AuthedRequest, res: Response) => {
    const applications = await db
      .select()
      .from(applicationsTable)
      .orderBy(desc(applicationsTable.createdAt));

    res.json(applications);
  },
);

router.patch(
  "/admin/applications/:id",
  requireAuth(),
  requireStaff(),
  async (req: AuthedRequest, res: Response) => {
    const parsed = UpdateApplicationStatusBody.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
      return;
    }

    const updates: Partial<typeof applicationsTable.$inferInsert> = {};
    if (parsed.data.status !== undefined) updates.status = parsed.data.status;
    if (parsed.data.dealType !== undefined)
      updates.dealType = parsed.data.dealType ?? null;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const id = String(req.params.id);
    const [updated] = await db
      .update(applicationsTable)
      .set(updates)
      .where(eq(applicationsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    res.json(updated);
  },
);

// ---------------------------------------------------------------------------
// Internal pipeline notes (staff + admin)
// ---------------------------------------------------------------------------

router.get(
  "/admin/applications/:id/notes",
  requireAuth(),
  requireStaff(),
  async (req: AuthedRequest, res: Response) => {
    const id = String(req.params.id);
    const notes = await db
      .select()
      .from(applicationNotesTable)
      .where(eq(applicationNotesTable.applicationId, id))
      .orderBy(desc(applicationNotesTable.createdAt));

    res.json(notes);
  },
);

router.post(
  "/admin/applications/:id/notes",
  requireAuth(),
  requireStaff(),
  async (req: AuthedRequest, res: Response) => {
    const parsed = CreateApplicationNoteBody.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
      return;
    }

    const id = String(req.params.id);
    const application = await db.query.applicationsTable.findFirst({
      where: eq(applicationsTable.id, id),
    });
    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    const [note] = await db
      .insert(applicationNotesTable)
      .values({
        applicationId: id,
        authorId: req.authUser!.id,
        authorName: displayName(req.authUser!),
        body: parsed.data.body,
      })
      .returning();

    res.status(201).json(note);
  },
);

// ---------------------------------------------------------------------------
// User management (admin only)
// ---------------------------------------------------------------------------

router.get(
  "/admin/users",
  requireAuth(),
  requireAdmin(),
  async (_req: AuthedRequest, res: Response) => {
    const users = await db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt));

    res.json(users);
  },
);

router.patch(
  "/admin/users/:id",
  requireAuth(),
  requireAdmin(),
  async (req: AuthedRequest, res: Response) => {
    const parsed = UpdateUserRoleBody.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
      return;
    }

    const id = String(req.params.id);

    // Guard against removing the last admin and locking everyone out. The
    // check-then-update runs in a transaction under the same advisory lock that
    // gates first-signup admin bootstrap, so concurrent demotions (and a racing
    // bootstrap) serialize and can't both pass the "more than one admin" check.
    // Shares ADMIN_BOOTSTRAP_LOCK (427819) in lib/auth.ts.
    const ADMIN_ROLE_LOCK = 427819;

    const result = await db.transaction(async (tx) => {
      const target = await tx.query.usersTable.findFirst({
        where: eq(usersTable.id, id),
      });
      if (!target) return { error: "notfound" as const };

      if (parsed.data.role !== "admin" && target.role === "admin") {
        await tx.execute(sql`select pg_advisory_xact_lock(${ADMIN_ROLE_LOCK})`);
        const [row] = await tx
          .select({ count: sql<number>`count(*)::int` })
          .from(usersTable)
          .where(eq(usersTable.role, "admin"));
        if ((row?.count ?? 0) <= 1) return { error: "lastadmin" as const };
      }

      const [updated] = await tx
        .update(usersTable)
        .set({ role: parsed.data.role })
        .where(eq(usersTable.id, id))
        .returning();
      return { updated };
    });

    if (result.error === "notfound") {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (result.error === "lastadmin") {
      res.status(400).json({ error: "Cannot remove the last remaining admin" });
      return;
    }

    res.json(result.updated);
  },
);

// ---------------------------------------------------------------------------
// Dashboard stats (staff + admin)
// ---------------------------------------------------------------------------

router.get(
  "/admin/stats",
  requireAuth(),
  requireStaff(),
  async (_req: AuthedRequest, res: Response) => {
    const [byStatus, byType, byRole, contactRow] = await Promise.all([
      db
        .select({
          key: applicationsTable.status,
          count: sql<number>`count(*)::int`,
        })
        .from(applicationsTable)
        .groupBy(applicationsTable.status),
      db
        .select({
          key: applicationsTable.type,
          count: sql<number>`count(*)::int`,
        })
        .from(applicationsTable)
        .groupBy(applicationsTable.type),
      db
        .select({ key: usersTable.role, count: sql<number>`count(*)::int` })
        .from(usersTable)
        .groupBy(usersTable.role),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(contactMessagesTable)
        .where(eq(contactMessagesTable.status, "new")),
    ]);

    const toMap = (rows: { key: string; count: number }[]) =>
      rows.reduce<Record<string, number>>((acc, r) => {
        acc[r.key] = r.count;
        return acc;
      }, {});

    const applicationsByStatus = toMap(byStatus);
    const applicationsByType = toMap(byType);
    const usersByRole = toMap(byRole);

    res.json({
      applicationsByStatus,
      applicationsByType,
      usersByRole,
      newContactMessages: contactRow[0]?.count ?? 0,
      totalApplications: Object.values(applicationsByStatus).reduce(
        (a, b) => a + b,
        0,
      ),
      totalUsers: Object.values(usersByRole).reduce((a, b) => a + b, 0),
    });
  },
);

export default router;
