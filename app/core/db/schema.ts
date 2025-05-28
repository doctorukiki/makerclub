/**
 * 통합 데이터베이스 스키마
 * 모든 features의 스키마를 한 곳에서 관리
 */

// Users 스키마
export * from "~/features/users/schema";

// Questions 스키마 (성향 평가)
export * from "~/features/questions/schema";

// Matches 스키마 (매칭)
export * from "~/features/matches/schema";

// Meetups 스키마 (만남)
export * from "~/features/meetups/schema";

// Chats 스키마 (채팅)
export * from "~/features/chats/schema";

// Feedbacks 스키마 (피드백)
export * from "~/features/feedbacks/schema";

// Payments 스키마 (결제)
export * from "~/features/payments/schema";
