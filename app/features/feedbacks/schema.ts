import { integer, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";

import { timestamps } from "~/core/db/helpers.server";

import { meetups } from "../meetups/schema";
import { emotionTagEnum, profiles } from "../users/schema";

export const feedbacks = pgTable(
  "feedbacks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meetupId: uuid("meetup_id")
      .references(() => meetups.id)
      .notNull(),
    writerId: uuid("writer_id")
      .references(() => profiles.profile_id)
      .notNull(),
    rating: integer("rating").notNull(), // 1 to 5
    comment: text("comment"),
    emotionTag: emotionTagEnum("emotion_tag"),
    ...timestamps,
  },
  (table) => ({
    uniqueWriter: unique("unique_feedback").on(table.meetupId, table.writerId),
  }),
);
