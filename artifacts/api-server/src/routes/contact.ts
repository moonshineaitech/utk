import { Router, type IRouter, type Request, type Response } from "express";
import {
  CreateContactMessageBody,
  UpdateContactMessageStatusBody,
} from "@workspace/api-zod";
import { db, contactMessagesTable } from "@workspace/db";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { requireAuth, requireStaff, type AuthedRequest } from "../lib/auth";
import { getClientIp } from "../lib/assistant";

const router: IRouter = Router();

// Soft, per-IP rate limits for the public (unauthenticated) contact endpoint.
// This is not a spend-bearing route, so a simple indexed row count is enough to
// curb casual spam without the assistant's advisory-lock machinery.
const PER_IP_HOURLY = 5;
const PER_IP_DAILY = 20;

// Columns safe to expose to admins — deliberately omits the stored request IP,
// which exists only for rate limiting.
const publicColumns = {
  id: contactMessagesTable.id,
  name: contactMessagesTable.name,
  email: contactMessagesTable.email,
  subject: contactMessagesTable.subject,
  message: contactMessagesTable.message,
  status: contactMessagesTable.status,
  createdAt: contactMessagesTable.createdAt,
};

async function countRecentByIp(ip: string, since: Date): Promise<number> {
  const [row] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(contactMessagesTable)
    .where(
      and(
        eq(contactMessagesTable.ip, ip),
        gte(contactMessagesTable.createdAt, since),
      ),
    );
  return row?.c ?? 0;
}

router.post("/contact", async (req: Request, res: Response) => {
  const parsed = CreateContactMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  // Honeypot: real users never see or fill this field. Pretend success so bots
  // don't learn they were filtered, but persist nothing.
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    res.status(201).json({ ok: true });
    return;
  }

  const ip = getClientIp(req);
  const now = Date.now();
  const hourAgo = new Date(now - 60 * 60 * 1000);
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000);

  if (
    (await countRecentByIp(ip, hourAgo)) >= PER_IP_HOURLY ||
    (await countRecentByIp(ip, dayAgo)) >= PER_IP_DAILY
  ) {
    res.status(429).json({
      error: "You've sent several messages recently. Please try again later.",
    });
    return;
  }

  await db.insert(contactMessagesTable).values({
    name: parsed.data.name.trim(),
    email: parsed.data.email.trim(),
    subject: parsed.data.subject?.trim() || null,
    message: parsed.data.message.trim(),
    ip,
  });

  res.status(201).json({ ok: true });
});

router.get(
  "/admin/contact",
  requireAuth(),
  requireStaff(),
  async (_req: AuthedRequest, res: Response) => {
    const messages = await db
      .select(publicColumns)
      .from(contactMessagesTable)
      .orderBy(desc(contactMessagesTable.createdAt));

    res.json(messages);
  },
);

router.patch(
  "/admin/contact/:id",
  requireAuth(),
  requireStaff(),
  async (req: AuthedRequest, res: Response) => {
    const parsed = UpdateContactMessageStatusBody.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
      return;
    }

    const id = String(req.params.id);
    const [updated] = await db
      .update(contactMessagesTable)
      .set({ status: parsed.data.status })
      .where(eq(contactMessagesTable.id, id))
      .returning(publicColumns);

    if (!updated) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    res.json(updated);
  },
);

export default router;
