import {
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { timestamps } from "~/core/db/helpers.server";
import { profiles } from "~/features/users/schema";

export const matchStatusEnum = pgEnum("match_status", [
  "pending",
  "accepted",
  "declined",
  "unmatched",
]);

export const matches = pgTable(
  "matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId1: uuid("user_id_1")
      .references(() => profiles.profile_id)
      .notNull(),
    userId2: uuid("user_id_2")
      .references(() => profiles.profile_id)
      .notNull(),
    initiatorId: uuid("initiator_id")
      .references(() => profiles.profile_id)
      .notNull(),
    status: matchStatusEnum("status").default("pending"),
    matchedAt: timestamp("matched_at", { withTimezone: true }),
    location: varchar("location", { length: 100 }),
    ...timestamps,
  },
  (table) => ({
    uniqueMatch: unique("unique_match").on(table.userId1, table.userId2),
  }),
);
