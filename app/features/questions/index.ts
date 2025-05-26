// 타입 및 검증 스키마 exports
export type {
	ChoiceAnswers,
	ScaleAnswers,
	PersonalityAssessment,
	ChoiceQuestionAnswer,
	ScaleQuestionAnswer,
	PersonalityTraits,
	CompatibilityScore,
	PersonalityAssessmentRecord,
	PersonalityDimension,
} from "./types";

export {
	ChoiceAnswersSchema,
	ScaleAnswersSchema,
	PersonalityAssessmentSchema,
	PERSONALITY_QUESTION_MAPPING,
	validatePersonalityAssessment,
	validateChoiceAnswers,
	validateScaleAnswers,
	isAssessmentComplete,
} from "./types";

// 데이터베이스 스키마 exports
export {
	questionCategoryEnum,
	questionStatusEnum,
	assessmentStatusEnum,
	questions,
	personalityAssessments,
	questionAnswers,
	compatibilityScores,
} from "./schema";

// 성향 분석 함수 exports
export {
	analyzePersonality,
	getMBTIType,
	getPersonalityDescription,
	calculateCompatibility,
	getRecommendedActivities,
} from "./personality-analyzer";
