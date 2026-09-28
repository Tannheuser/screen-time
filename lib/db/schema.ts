import { sql } from "drizzle-orm";
import {
  check,
  index,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const parents = pgTable("parents", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
}).enableRLS();

export const unlockSessionStatus = pgEnum("unlock_session_status", [
  "active",
  "completed",
  "cancelled",
]);

export const unlockSessions = pgTable(
  "unlock_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    parentId: uuid("parent_id")
      .notNull()
      .references(() => parents.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    // Server-only encrypted value; never include in child-facing responses.
    passcodeCiphertext: text("passcode_ciphertext").notNull(),
    status: unlockSessionStatus("status").default("active").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("unlock_sessions_parent_id_idx").on(table.parentId),
    uniqueIndex("unlock_sessions_one_active_per_parent_idx")
      .on(table.parentId)
      .where(sql`${table.status} = 'active'`),
    check(
      "unlock_sessions_completion_check",
      sql`(${table.status} = 'completed') = (${table.completedAt} IS NOT NULL)`,
    ),
  ],
).enableRLS();

export const sessionChallenges = pgTable(
  "session_challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => unlockSessions.id, { onDelete: "cascade" }),
    position: smallint("position").notNull(),
    title: text("title").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("session_challenges_session_position_idx").on(
      table.sessionId,
      table.position,
    ),
    check("session_challenges_position_check", sql`${table.position} BETWEEN 1 AND 4`),
    check(
      "session_challenges_completion_requires_start_check",
      sql`${table.completedAt} IS NULL OR ${table.startedAt} IS NOT NULL`,
    ),
  ],
).enableRLS();
