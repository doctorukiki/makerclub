import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { timestamps } from "~/core/db/helpers.server";

import { matches } from "../matches/schema";
import { profiles } from "../users/schema";

export const messageTypeEnum = pgEnum("message_type", [
  "text",
  "system",
  "location",
]);

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id")
    .references(() => matches.id)
    .notNull(),
  senderId: uuid("sender_id")
    .references(() => profiles.profile_id)
    .notNull(),
  content: text("content").notNull(),
  messageType: messageTypeEnum("message_type").default("text"),
  readAt: timestamp("read_at", { withTimezone: true }),
  ...timestamps,
});
