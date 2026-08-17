import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * One row per free-form AI assistant message. Used purely for abuse / cost
 * rate limiting (per-IP windows + a global daily spend cap). No PII beyond the
 * request IP is stored, and rows can be pruned freely.
 */
export const assistantUsageTable = pgTable(
  "assistant_usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ip: text("ip").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("assistant_usage_ip_created_idx").on(t.ip, t.createdAt),
    index("assistant_usage_created_idx").on(t.createdAt),
  ],
);

export type AssistantUsage = typeof assistantUsageTable.$inferSelect;
