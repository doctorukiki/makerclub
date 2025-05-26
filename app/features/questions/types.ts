import { z } from "zod";

// 선택형 질문 답변 (1-30번 질문, 각각 0 또는 1의 선택지)
export const ChoiceAnswersSchema = z.record(
	z.string().regex(/^([1-9]|[12][0-9]|30)$/), // 1-30 범위의 문자열 키
	z.number().int().min(0).max(1) // 0 또는 1의 값
);

// 점수형 질문 답변 (31-40번 질문, 각각 1-10점)
export const ScaleAnswersSchema = z.record(
	z.string().regex(/^(3[1-9]|40)$/), // 31-40 범위의 문자열 키
	z.number().int().min(1).max(10) // 1-10점 범위의 값
);

// 성향 평가 결과 전체 스키마
export const PersonalityAssessmentSchema = z.object({
	choiceAnswers: ChoiceAnswersSchema,
	scaleAnswers: ScaleAnswersSchema,
	completedAt: z.date().optional(), // 완료 시간
	userId: z.string().optional(), // 사용자 ID (Supabase Auth)
});

// TypeScript 타입 정의
export type ChoiceAnswers = z.infer<typeof ChoiceAnswersSchema>;
export type ScaleAnswers = z.infer<typeof ScaleAnswersSchema>;
export type PersonalityAssessment = z.infer<typeof PersonalityAssessmentSchema>;

// 개별 질문 답변 타입
export interface ChoiceQuestionAnswer {
	questionId: number; // 1-30
	selectedOption: number; // 0 또는 1
}

export interface ScaleQuestionAnswer {
	questionId: number; // 31-40
	score: number; // 1-10
}

// 성향 분석 결과를 위한 추가 타입들
export interface PersonalityTraits {
	// MBTI 스타일 성향 분석
	extroversion: number; // 외향성 점수 (0-100)
	intuition: number; // 직관성 점수 (0-100)
	thinking: number; // 사고형 점수 (0-100)
	judging: number; // 판단형 점수 (0-100)

	// 추가 성향 지표
	openness: number; // 개방성 (0-100)
	conscientiousness: number; // 성실성 (0-100)
	agreeableness: number; // 친화성 (0-100)
	neuroticism: number; // 신경성 (0-100)

	// 여행/만남 관련 성향
	spontaneity: number; // 즉흥성 (0-100)
	socialEnergy: number; // 사회적 에너지 (0-100)
	adaptability: number; // 적응력 (0-100)
	leadership: number; // 리더십 (0-100)
}

// 매칭을 위한 호환성 점수
export interface CompatibilityScore {
	userId1: string;
	userId2: string;
	overallScore: number; // 전체 호환성 점수 (0-100)
	traitScores: {
		personalityMatch: number; // 성격 매칭 점수
		interestAlignment: number; // 관심사 일치도
		communicationStyle: number; // 소통 스타일 매칭
		activityPreference: number; // 활동 선호도 매칭
	};
	calculatedAt: Date;
}

// Supabase 테이블을 위한 데이터베이스 스키마
export interface PersonalityAssessmentRecord {
	id: string;
	user_id: string;
	choice_answers: Record<string, number>; // JSON 형태로 저장
	scale_answers: Record<string, number>; // JSON 형태로 저장
	personality_traits: PersonalityTraits | null; // 분석된 성향 결과
	completed_at: string; // ISO 날짜 문자열
	created_at: string;
	updated_at: string;
}

// 성향 평가 결과 검증 함수
export function validatePersonalityAssessment(
	data: unknown
): PersonalityAssessment {
	return PersonalityAssessmentSchema.parse(data);
}

// 선택형 답변 검증 함수
export function validateChoiceAnswers(data: unknown): ChoiceAnswers {
	return ChoiceAnswersSchema.parse(data);
}

// 점수형 답변 검증 함수
export function validateScaleAnswers(data: unknown): ScaleAnswers {
	return ScaleAnswersSchema.parse(data);
}

// 답변 완성도 체크 함수
export function isAssessmentComplete(
	choiceAnswers: ChoiceAnswers,
	scaleAnswers: ScaleAnswers
): boolean {
	// 1-30번 선택형 질문이 모두 답변되었는지 확인
	const choiceQuestionIds = Array.from({ length: 30 }, (_, i) =>
		(i + 1).toString()
	);
	const hasAllChoiceAnswers = choiceQuestionIds.every(
		(id) =>
			id in choiceAnswers &&
			typeof choiceAnswers[id] === "number" &&
			[0, 1].includes(choiceAnswers[id])
	);

	// 31-40번 점수형 질문이 모두 답변되었는지 확인
	const scaleQuestionIds = Array.from({ length: 10 }, (_, i) =>
		(i + 31).toString()
	);
	const hasAllScaleAnswers = scaleQuestionIds.every(
		(id) =>
			id in scaleAnswers &&
			typeof scaleAnswers[id] === "number" &&
			scaleAnswers[id] >= 1 &&
			scaleAnswers[id] <= 10
	);

	return hasAllChoiceAnswers && hasAllScaleAnswers;
}

// 성향 점수 계산을 위한 질문 매핑
export const PERSONALITY_QUESTION_MAPPING = {
	// 외향성 관련 질문들 (높을수록 외향적)
	extroversion: {
		choice: [4, 6, 11, 12, 25, 29], // 회식, 즉석만남, 분위기메이커, 사람있는곳, 먼저말걸기, 사람많은곳
		scale: [32, 37], // 감정표현, 영향력
	},

	// 직관성 관련 질문들 (높을수록 직관적)
	intuition: {
		choice: [7, 13, 17, 19, 20], // 일단눌러보기, 새로운메뉴, 끌리는맛집, 이사설렘, 바로결제
		scale: [34, 38], // 변화신남, 즉흥결정
	},

	// 사고형 관련 질문들 (높을수록 논리적)
	thinking: {
		choice: [2, 22, 23, 27], // 해결책제시, 리드하기, 실용적선물, 어떻게할거야
		scale: [36], // 뚜렷한신념
	},

	// 판단형 관련 질문들 (높을수록 계획적)
	judging: {
		choice: [1, 8, 9, 16, 18, 26, 28], // 미리계획, 리스트작성, 깔끔정리, 바로답장, 기다리기, 미리야근, 미리휴가
		scale: [40], // 비슷한일상
	},

	// 개방성 (새로운 경험에 대한 개방성)
	openness: {
		choice: [5, 13, 14, 15, 19], // 자극적영화, 새로운메뉴, 독특한배경, 독특한옷, 이사설렘
		scale: [34, 38], // 변화신남, 즉흥결정
	},

	// 성실성 (책임감과 조직성)
	conscientiousness: {
		choice: [1, 8, 9, 16, 26, 28], // 미리계획, 리스트작성, 깔끔정리, 바로답장, 미리야근, 미리휴가
		scale: [40], // 비슷한일상
	},

	// 친화성 (타인에 대한 배려와 협력)
	agreeableness: {
		choice: [3, 6, 18, 22], // 다른사람먼저, 만나기힘들어, 기다리기, 의견물어보기
		scale: [32, 33], // 감정표현, 유연성
	},

	// 신경성 (정서적 안정성, 낮을수록 안정적)
	neuroticism: {
		choice: [19, 21], // 이사불안, 혼자삭히기
		scale: [31, 35, 39], // 감동받기, 혼자시간, 자기성찰
	},
} as const;

export type PersonalityDimension = keyof typeof PERSONALITY_QUESTION_MAPPING;
