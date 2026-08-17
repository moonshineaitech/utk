import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

/**
 * Public contact form submissions. Anyone (no auth) can create one; only admins
 * read them in the dashboard inbox. The request IP is stored solely for soft,
 * per-IP rate limiting of the public endpoint and is never exposed via the API.
 */
export const contactMessagesTable = pgTable(
  "contact_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject"),
    message: text("message").notNull(),
    ip: text("ip"),
    status: text("status", {
      enum: ["new", "read", "archived"],
    })
      .notNull()
      .default("new"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("contact_messages_ip_created_idx").on(t.ip, t.createdAt),
    index("contact_messages_status_created_idx").on(t.status, t.createdAt),
  ],
);

export const selectContactMessageSchema = createSelectSchema(contactMessagesTable);

export type ContactMessage = typeof contactMessagesTable.$inferSelect;
export type ContactStatus = ContactMessage["status"];
export type InsertContactMessage = z.infer<typeof selectContactMessageSchema>;
