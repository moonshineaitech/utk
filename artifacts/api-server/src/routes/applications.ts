import { Router, type IRouter, type Response } from "express";
import { CreateApplicationBody } from "@workspace/api-zod";
import { db, applicationsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { requireAuth, type AuthedRequest } from "../lib/auth";

const router: IRouter = Router();

router.post(
  "/applications",
  requireAuth(),
  async (req: AuthedRequest, res: Response) => {
    const parsed = CreateApplicationBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
      return;
    }

    const [application] = await db
      .insert(applicationsTable)
      .values({
        userId: req.authUser!.id,
        type: parsed.data.type,
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company ?? null,
        message: parsed.data.message,
        budget: parsed.data.budget ?? null,
      })
      .returning();

    res.status(201).json(application);
  },
);

router.get(
  "/applications/mine",
  requireAuth(),
  async (req: AuthedRequest, res: Response) => {
    const applications = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.userId, req.authUser!.id))
      .orderBy(desc(applicationsTable.createdAt));

    res.json(applications);
  },
);

export default router;
