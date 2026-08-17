import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

/** Ordered enrollment pipeline for an application/request. */
export const APPLICATION_STATUSES = [
  "new",
  "reviewing",
  "interview",
  "offer",
  "accepted",
  "declined",
  "waitlisted",
] as const;

/** Commercial structure of an engagement (all are paid; equity clients pay too). */
export const DEAL_TYPES = ["retainer", "equity", "hybrid"] as const;

export const applicationsTable = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: text("type", {
      enum: ["internship", "studio", "coaching"],
    }).notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    message: text("message").notNull(),
    budget: text("budget"),
    status: text("status", { enum: APPLICATION_STATUSES })
      .notNull()
      .default("new"),
    dealType: text("deal_type", { enum: DEAL_TYPES }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("applications_status_created_idx").on(t.status, t.createdAt),
    index("applications_user_created_idx").on(t.userId, t.createdAt),
  ],
);

/**
 * Internal pipeline notes left by staff/admins on an application. Never exposed
 * to the applicant; only readable through the admin dashboard.
 */
export const applicationNotesTable = pgTable(
  "application_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applicationsTable.id, { onDelete: "cascade" }),
    authorId: uuid("author_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),
    authorName: text("author_name"),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("application_notes_application_created_idx").on(
      t.applicationId,
      t.createdAt,
    ),
  ],
);

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit(
  {
    id: true,
    userId: true,
    status: true,
    dealType: true,
    createdAt: true,
  },
);
export const selectApplicationSchema = createSelectSchema(applicationsTable);
export const selectApplicationNoteSchema =
  createSelectSchema(applicationNotesTable);

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
export type ApplicationType = Application["type"];
export type ApplicationStatus = Application["status"];
export type DealType = (typeof DEAL_TYPES)[number];
export type ApplicationNote = typeof applicationNotesTable.$inferSelect;
