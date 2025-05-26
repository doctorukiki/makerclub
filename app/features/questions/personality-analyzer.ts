import type {
	ChoiceAnswers,
	ScaleAnswers,
	PersonalityTraits,
	PersonalityDimension,
} from "./types";
import { PERSONALITY_QUESTION_MAPPING } from "./types";

/**
 * 성향 평가 결과를 분석하여 PersonalityTraits를 계산합니다.
 */
export function analyzePersonality(
	choiceAnswers: ChoiceAnswers,
	scaleAnswers: ScaleAnswers
): PersonalityTraits {
	const traits: PersonalityTraits = {
		extroversion: calculateDimensionScore(
			"extroversion",
			choiceAnswers,
			scaleAnswers
		),
		intuition: calculateDimensionScore(
			"intuition",
			choiceAnswers,
			scaleAnswers
		),
		thinking: calculateDimensionScore(
			"thinking",
			choiceAnswers,
			scaleAnswers
		),
		judging: calculateDimensionScore(
			"judging",
			choiceAnswers,
			scaleAnswers
		),
		openness: calculateDimensionScore(
			"openness",
			choiceAnswers,
			scaleAnswers
		),
		conscientiousness: calculateDimensionScore(
			"conscientiousness",
			choiceAnswers,
			scaleAnswers
		),
		agreeableness: calculateDimensionScore(
			"agreeableness",
			choiceAnswers,
			scaleAnswers
		),
		neuroticism: calculateDimensionScore(
			"neuroticism",
			choiceAnswers,
			scaleAnswers
		),
		spontaneity: 0,
		socialEnergy: 0,
		adaptability: 0,
		leadership: 0,
	};

	// 복합 지표 계산
	traits.spontaneity = Math.round(
		(traits.intuition + (100 - traits.judging)) / 2
	);
	traits.socialEnergy = Math.round(
		(traits.extroversion + (100 - traits.neuroticism)) / 2
	);
	traits.adaptability = Math.round(
		(traits.openness + traits.agreeableness) / 2
	);
	traits.leadership = Math.round((traits.extroversion + traits.thinking) / 2);

	return traits;
}

/**
 * 특정 성향 차원의 점수를 계산합니다.
 */
function calculateDimensionScore(
	dimension: PersonalityDimension,
	choiceAnswers: ChoiceAnswers,
	scaleAnswers: ScaleAnswers
): number {
	const mapping = PERSONALITY_QUESTION_MAPPING[dimension];
	let totalScore = 0;
	let totalQuestions = 0;

	// 선택형 질문 점수 계산
	if (mapping.choice) {
		for (const questionId of mapping.choice) {
			const answer = choiceAnswers[questionId.toString()];
			if (answer !== undefined) {
				// 선택형 질문: 0 = 0점, 1 = 100점
				totalScore += answer * 100;
				totalQuestions++;
			}
		}
	}

	// 점수형 질문 점수 계산
	if (mapping.scale) {
		for (const questionId of mapping.scale) {
			const answer = scaleAnswers[questionId.toString()];
			if (answer !== undefined) {
				// 점수형 질문: 1-10점을 0-100점으로 변환
				totalScore += ((answer - 1) / 9) * 100;
				totalQuestions++;
			}
		}
	}

	// 평균 점수 계산 (0-100 범위)
	return totalQuestions > 0 ? Math.round(totalScore / totalQuestions) : 50;
}

/**
 * MBTI 스타일 성격 유형을 문자열로 반환합니다.
 */
export function getMBTIType(traits: PersonalityTraits): string {
	const e_i = traits.extroversion >= 50 ? "E" : "I";
	const s_n = traits.intuition >= 50 ? "N" : "S";
	const t_f = traits.thinking >= 50 ? "T" : "F";
	const j_p = traits.judging >= 50 ? "J" : "P";

	return `${e_i}${s_n}${t_f}${j_p}`;
}

/**
 * 성향 특성을 한국어 설명으로 변환합니다.
 */
export function getPersonalityDescription(traits: PersonalityTraits): {
	mbtiType: string;
	primaryTraits: string[];
	description: string;
} {
	const mbtiType = getMBTIType(traits);
	const primaryTraits: string[] = [];

	// 주요 특성 추출 (70점 이상인 특성들)
	if (traits.extroversion >= 70) primaryTraits.push("외향적");
	if (traits.extroversion <= 30) primaryTraits.push("내향적");
	if (traits.intuition >= 70) primaryTraits.push("직관적");
	if (traits.thinking >= 70) primaryTraits.push("논리적");
	if (traits.judging >= 70) primaryTraits.push("계획적");
	if (traits.openness >= 70) primaryTraits.push("개방적");
	if (traits.conscientiousness >= 70) primaryTraits.push("성실한");
	if (traits.agreeableness >= 70) primaryTraits.push("친화적");
	if (traits.spontaneity >= 70) primaryTraits.push("즉흥적");
	if (traits.socialEnergy >= 70) primaryTraits.push("사교적");
	if (traits.adaptability >= 70) primaryTraits.push("적응력 좋은");
	if (traits.leadership >= 70) primaryTraits.push("리더십 있는");

	// MBTI 유형별 설명
	const mbtiDescriptions: Record<string, string> = {
		ENFJ: "따뜻하고 적극적이며 책임감이 강한 지도자형",
		ENFP: "열정적이고 상상력이 풍부한 활동가형",
		ENTJ: "대담하고 의지가 강한 통솔자형",
		ENTP: "똑똑하고 호기심이 많은 변론가형",
		ESFJ: "사교적이고 인기가 많은 외교관형",
		ESFP: "자유로운 영혼의 연예인형",
		ESTJ: "엄격하고 질서정연한 관리자형",
		ESTP: "모험을 즐기는 사업가형",
		INFJ: "선의를 가진 옹호자형",
		INFP: "열정적이고 독창적인 중재자형",
		INTJ: "상상력이 풍부한 전략가형",
		INTP: "혁신적인 발명가형",
		ISFJ: "실용적이고 따뜻한 수호자형",
		ISFP: "호기심이 많은 예술가형",
		ISTJ: "현실적이고 책임감 있는 논리주의자형",
		ISTP: "만능 재주꾼형",
	};

	const description = mbtiDescriptions[mbtiType] || "독특한 성향의 소유자";

	return {
		mbtiType,
		primaryTraits,
		description,
	};
}

/**
 * 두 사용자 간의 호환성 점수를 계산합니다.
 */
export function calculateCompatibility(
	traits1: PersonalityTraits,
	traits2: PersonalityTraits
): number {
	// 성격 특성별 가중치
	const weights = {
		extroversion: 0.15,
		intuition: 0.1,
		thinking: 0.1,
		judging: 0.1,
		openness: 0.15,
		agreeableness: 0.2,
		socialEnergy: 0.1,
		adaptability: 0.1,
	};

	let totalScore = 0;
	let totalWeight = 0;

	// 각 특성별 호환성 계산
	Object.entries(weights).forEach(([trait, weight]) => {
		const trait1 = traits1[trait as keyof PersonalityTraits];
		const trait2 = traits2[trait as keyof PersonalityTraits];

		// 특성별 호환성 로직
		let compatibility = 0;

		if (trait === "extroversion" || trait === "socialEnergy") {
			// 외향성/사교성: 적당한 차이가 좋음 (완전히 같거나 너무 다르면 낮은 점수)
			const difference = Math.abs(trait1 - trait2);
			compatibility =
				difference <= 30
					? 100 - difference
					: 100 - (difference - 30) * 2;
		} else if (trait === "agreeableness" || trait === "adaptability") {
			// 친화성/적응력: 높을수록 좋음
			compatibility = (trait1 + trait2) / 2;
		} else {
			// 기타 특성: 유사할수록 좋음
			const difference = Math.abs(trait1 - trait2);
			compatibility = Math.max(0, 100 - difference);
		}

		totalScore += compatibility * weight;
		totalWeight += weight;
	});

	return Math.round(totalScore / totalWeight);
}

/**
 * 성향 기반 추천 활동을 반환합니다.
 */
export function getRecommendedActivities(traits: PersonalityTraits): string[] {
	const activities: string[] = [];

	if (traits.extroversion >= 60) {
		activities.push("그룹 활동", "파티", "네트워킹 이벤트");
	} else {
		activities.push("조용한 카페", "박물관 관람", "소규모 모임");
	}

	if (traits.openness >= 60) {
		activities.push("새로운 음식 체험", "문화 체험", "모험 활동");
	} else {
		activities.push("익숙한 장소 방문", "전통 음식", "안정적인 활동");
	}

	if (traits.spontaneity >= 60) {
		activities.push("즉흥 여행", "랜덤 장소 탐험", "새로운 도전");
	} else {
		activities.push("계획된 투어", "예약 필수 장소", "체계적인 관광");
	}

	return activities;
}
