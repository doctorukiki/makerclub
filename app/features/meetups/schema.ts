/**
 * Meetup Schema
 * 사용자 만남 정보 저장
 *
 *
 */
import {
	boolean,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

import { timestamps } from "~/core/db/helpers.server";

import { matches } from "../matches/schema";
import { meetupStatusEnum, profiles } from "../users/schema";

export const meetups = pgTable("meetups", {
	id: uuid("id").primaryKey().defaultRandom(),
	matchId: uuid("match_id")
		.references(() => matches.id)
		.notNull(),
	proposedById: uuid("proposed_by_id")
		.references(() => profiles.profile_id)
		.notNull(),
	proposedTime: timestamp("proposed_time", { withTimezone: true }),
	proposedLocation: varchar("proposed_location", { length: 255 }),
	status: meetupStatusEnum("status").default("proposed"),
	confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
	feedbackWritten: boolean("feedback_written").default(false),
	...timestamps,
});
