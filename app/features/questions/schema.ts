/**
 * Questions Schema
 * 성향 평가 질문과 결과 저장
 *
 */
import { sql } from "drizzle-orm";
import {
	integer,
	jsonb,
	pgEnum,
	pgPolicy,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { authUid, authUsers, authenticatedRole } from "drizzle-orm/supabase";

import { timestamps } from "~/core/db/helpers.server";
import { profiles } from "../users/schema";

/**
 * Question Categories Enum
 * 질문 카테고리 분류
 */
export const questionCategoryEnum = pgEnum("question_category", [
	"choice", // 선택형 질문 (1-30번)
	"scale", // 점수형 질문 (31-40번)
]);

/**
 * Question Status Enum
 * 질문 상태
 */
export const questionStatusEnum = pgEnum("question_status", [
	"active", // 활성화된 질문
	"inactive", // 비활성화된 질문
	"archived", // 보관된 질문
]);

/**
 * Assessment Status Enum
 * 평가 상태
 */
export const assessmentStatusEnum = pgEnum("assessment_status", [
	"in_progress", // 진행 중
	"completed", // 완료
	"abandoned", // 중단됨
]);

/**
 * Questions Table
 * 성향 평가 질문들을 저장하는 테이블
 */
export const questions = pgTable("questions", {
	id: uuid("id").primaryKey().defaultRandom(),
	question_number: integer("question_number").notNull().unique(), // 1-40
	category: questionCategoryEnum("category").notNull(),
	question_text: text("question_text").notNull(),
	options: jsonb("options"), // 선택형 질문의 경우 선택지 배열, 점수형은 null
	left_emoji: text("left_emoji"), // 점수형 질문의 왼쪽 이모지
	right_emoji: text("right_emoji"), // 점수형 질문의 오른쪽 이모지
	personality_dimensions: jsonb("personality_dimensions"), // 이 질문이 측정하는 성향 차원들
	status: questionStatusEnum("status").notNull().default("active"),
	...timestamps,
});

/**
 * Personality Assessments Table
 * 사용자별 성향 평가 결과를 저장하는 테이블
 */
export const personalityAssessments = pgTable(
	"personality_assessments",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		user_id: uuid("user_id")
			.references(() => profiles.profile_id, {
				onDelete: "cascade",
			})
			.notNull(),
		status: assessmentStatusEnum("status").notNull().default("in_progress"),
		choice_answers: jsonb("choice_answers").notNull().default("{}"), // {questionId: selectedOption}
		scale_answers: jsonb("scale_answers").notNull().default("{}"), // {questionId: score}

		// 분석된 성향 결과
		personality_traits: jsonb("personality_traits"), // PersonalityTraits 객체
		mbti_type: text("mbti_type"), // ENFP, INTJ 등
		primary_traits: jsonb("primary_traits"), // 주요 특성 배열
		description: text("description"), // 성향 설명
		recommended_activities: jsonb("recommended_activities"), // 추천 활동 배열

		completed_at: timestamp("completed_at", { withTimezone: true }),
		...timestamps,
	},
	(table) => [
		// RLS Policy: 사용자는 자신의 평가 결과만 조회 가능
		pgPolicy("select-assessment-policy", {
			for: "select",
			to: authenticatedRole,
			as: "permissive",
			using: sql`${authUid} = ${table.user_id}`,
		}),
		// RLS Policy: 사용자는 자신의 평가 결과만 수정 가능
		pgPolicy("update-assessment-policy", {
			for: "update",
			to: authenticatedRole,
			as: "permissive",
			withCheck: sql`${authUid} = ${table.user_id}`,
			using: sql`${authUid} = ${table.user_id}`,
		}),
		// RLS Policy: 사용자는 자신의 평가 결과만 삭제 가능
		pgPolicy("delete-assessment-policy", {
			for: "delete",
			to: authenticatedRole,
			as: "permissive",
			using: sql`${authUid} = ${table.user_id}`,
		}),
	]
);

/**
 * Question Answers Table
 * 개별 질문에 대한 답변을 저장하는 테이블 (상세 추적용)
 */
export const questionAnswers = pgTable(
	"question_answers",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		assessment_id: uuid("assessment_id")
			.references(() => personalityAssessments.id, {
				onDelete: "cascade",
			})
			.notNull(),
		question_id: uuid("question_id")
			.references(() => questions.id)
			.notNull(),
		question_number: integer("question_number").notNull(), // 1-40
		answer_value: integer("answer_value").notNull(), // 선택형: 0/1, 점수형: 1-10
		answered_at: timestamp("answered_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		...timestamps,
	},
	(table) => [
		// RLS Policy: 사용자는 자신의 답변만 조회 가능
		pgPolicy("select-answer-policy", {
			for: "select",
			to: authenticatedRole,
			as: "permissive",
			using: sql`
				EXISTS (
					SELECT 1 FROM ${personalityAssessments} 
					WHERE ${personalityAssessments.id} = ${table.assessment_id} 
					AND ${personalityAssessments.user_id} = ${authUid}
				)
			`,
		}),
	]
);

/**
 * Compatibility Scores Table
 * 사용자 간 호환성 점수를 저장하는 테이블
 */
export const compatibilityScores = pgTable(
	"compatibility_scores",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		user1_id: uuid("user1_id")
			.references(() => profiles.profile_id)
			.notNull(),
		user2_id: uuid("user2_id")
			.references(() => profiles.profile_id)
			.notNull(),
		overall_score: integer("overall_score").notNull(), // 0-100
		trait_scores: jsonb("trait_scores").notNull(), // 세부 호환성 점수들
		calculated_at: timestamp("calculated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		...timestamps,
	},
	(table) => [
		// RLS Policy: 사용자는 자신과 관련된 호환성 점수만 조회 가능
		pgPolicy("select-compatibility-policy", {
			for: "select",
			to: authenticatedRole,
			as: "permissive",
			using: sql`${authUid} = ${table.user1_id} OR ${authUid} = ${table.user2_id}`,
		}),
	]
);
