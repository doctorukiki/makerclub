CREATE TYPE "public"."emotion_tag" AS ENUM('warm', 'fun', 'awkward', 'disappointing');--> statement-breakpoint
CREATE TYPE "public"."meetup_status" AS ENUM('proposed', 'confirmed', 'declined', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('text', 'system', 'location');--> statement-breakpoint
CREATE TYPE "public"."profile_visibility" AS ENUM('public', 'hidden');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('traveler', 'local_host', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'banned');--> statement-breakpoint
CREATE TYPE "public"."assessment_status" AS ENUM('in_progress', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."question_category" AS ENUM('choice', 'scale');--> statement-breakpoint
CREATE TYPE "public"."question_status" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"bio" text,
	"language" jsonb DEFAULT '["korean"]' NOT NULL,
	"interests" jsonb,
	"location" varchar(100),
	"is_host" boolean DEFAULT false NOT NULL,
	"avatar_url" text,
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"role" "user_role" NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "compatibility_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user1_id" uuid NOT NULL,
	"user2_id" uuid NOT NULL,
	"overall_score" integer NOT NULL,
	"trait_scores" jsonb NOT NULL,
	"calculated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "compatibility_scores" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "personality_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "assessment_status" DEFAULT 'in_progress' NOT NULL,
	"choice_answers" jsonb DEFAULT '{}' NOT NULL,
	"scale_answers" jsonb DEFAULT '{}' NOT NULL,
	"personality_traits" jsonb,
	"mbti_type" text,
	"primary_traits" jsonb,
	"description" text,
	"recommended_activities" jsonb,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "personality_assessments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "question_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"question_number" integer NOT NULL,
	"answer_value" integer NOT NULL,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "question_answers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_number" integer NOT NULL,
	"category" "question_category" NOT NULL,
	"question_text" text NOT NULL,
	"options" jsonb,
	"left_emoji" text,
	"right_emoji" text,
	"personality_dimensions" jsonb,
	"status" "question_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "questions_question_number_unique" UNIQUE("question_number")
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_scores" ADD CONSTRAINT "compatibility_scores_user1_id_profiles_profile_id_fk" FOREIGN KEY ("user1_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_scores" ADD CONSTRAINT "compatibility_scores_user2_id_profiles_profile_id_fk" FOREIGN KEY ("user2_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personality_assessments" ADD CONSTRAINT "personality_assessments_user_id_profiles_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_answers" ADD CONSTRAINT "question_answers_assessment_id_personality_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."personality_assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_answers" ADD CONSTRAINT "question_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "edit-profile-policy" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id") WITH CHECK ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-profile-policy" ON "profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "select-profile-policy" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "select-compatibility-policy" ON "compatibility_scores" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "compatibility_scores"."user1_id" OR (select auth.uid()) = "compatibility_scores"."user2_id");--> statement-breakpoint
CREATE POLICY "select-assessment-policy" ON "personality_assessments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "personality_assessments"."user_id");--> statement-breakpoint
CREATE POLICY "update-assessment-policy" ON "personality_assessments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "personality_assessments"."user_id") WITH CHECK ((select auth.uid()) = "personality_assessments"."user_id");--> statement-breakpoint
CREATE POLICY "delete-assessment-policy" ON "personality_assessments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "personality_assessments"."user_id");--> statement-breakpoint
CREATE POLICY "select-answer-policy" ON "question_answers" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
				EXISTS (
					SELECT 1 FROM "personality_assessments" 
					WHERE "personality_assessments"."id" = "question_answers"."assessment_id" 
					AND "personality_assessments"."user_id" = (select auth.uid())
				)
			);