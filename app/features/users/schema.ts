/**
 * User Profile Schema
 *
 * This file defines the database schema for user profiles and sets up
 * Supabase Row Level Security (RLS) policies to control data access.
 */
import { sql } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { authUid, authUsers, authenticatedRole } from "drizzle-orm/supabase";

import { timestamps } from "~/core/db/helpers.server";

/**
 * Profiles Table
 *
 * Stores additional user profile information beyond the core auth data.
 * Links to Supabase auth.users table via profile_id foreign key.
 *
 * Includes Row Level Security (RLS) policies to ensure users can only
 * access and modify their own profile data.
 */

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "traveler",
  "local_host",
  "admin",
]);
export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "banned",
]);

export const messageTypeEnum = pgEnum("message_type", [
  "text",
  "system",
  "location",
]);
export const meetupStatusEnum = pgEnum("meetup_status", [
  "proposed",
  "confirmed",
  "declined",
  "completed",
  "cancelled",
]);
export const profileVisibilityEnum = pgEnum("profile_visibility", [
  "public",
  "hidden",
]);
export const emotionTagEnum = pgEnum("emotion_tag", [
  "warm",
  "fun",
  "awkward",
  "disappointing",
]);

export const profiles = pgTable(
  "profiles",
  {
    // Primary key that references the Supabase auth.users id
    // Using CASCADE ensures profile is deleted when user is deleted
    profile_id: uuid()
      .primaryKey()
      .references(() => authUsers.id, {
        onDelete: "cascade",
      }),
    name: text().notNull(),
    bio: text("bio"),
    language: jsonb("language").notNull().default('["korean"]'), // array of ISO codes
    interests: jsonb("interests"), // array of strings
    location: varchar("location", { length: 100 }),
    is_host: boolean("is_host").notNull().default(false),

    avatar_url: text(),
    marketing_consent: boolean("marketing_consent").notNull().default(false),
    // 추가 필드
    role: userRoleEnum("role").notNull(),
    status: userStatusEnum("status").notNull().default("active"),
    // Adds created_at and updated_at timestamp columns
    ...timestamps,
  },
  (table) => [
    // RLS Policy: Users can only update their own profile
    pgPolicy("edit-profile-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only delete their own profile
    pgPolicy("delete-profile-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only view their own profile
    pgPolicy("select-profile-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);
