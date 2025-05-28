import { useState } from "react";
import { Link, Form, redirect } from "react-router";
import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
} from "react-router";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	ChevronLeft,
	ChevronRight,
	Heart,
	CheckCircle,
	ArrowRight,
} from "lucide-react";

// 서버 액션 - 성향 평가 결과 저장
export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const choiceAnswers = JSON.parse(formData.get("choiceAnswers") as string);
	const scaleAnswers = JSON.parse(formData.get("scaleAnswers") as string);

	try {
		// 스키마 검증
		const {
			validateChoiceAnswers,
			validateScaleAnswers,
			isAssessmentComplete,
			analyzePersonality,
		} = await import("~/features/questions");

		const validatedChoiceAnswers = validateChoiceAnswers(choiceAnswers);
		const validatedScaleAnswers = validateScaleAnswers(scaleAnswers);

		// 완성도 체크
		if (
			!isAssessmentComplete(validatedChoiceAnswers, validatedScaleAnswers)
		) {
			return {
				errors: {
					general: "모든 질문에 답변해주세요.",
				},
			};
		}

		// 성향 분석
		const personalityTraits = analyzePersonality(
			validatedChoiceAnswers,
			validatedScaleAnswers
		);

		console.log("성향 평가 결과:", {
			choiceAnswers: validatedChoiceAnswers,
			scaleAnswers: validatedScaleAnswers,
			personalityTraits,
		});

		// 현재 로그인된 사용자 정보 가져오기
		const url = new URL(request.url);
		const userIdFromUrl = url.searchParams.get("userId");

		let userId: string;

		if (userIdFromUrl) {
			// URL 파라미터에서 사용자 ID 가져오기 (회원가입 직후)
			userId = userIdFromUrl;
			console.log("📋 URL에서 가져온 사용자 ID:", userId);
		} else {
			// 세션에서 사용자 ID 가져오기 (일반적인 경우)
			const { getSession } = await import("~/lib/supabase.server");
			const session = await getSession(request);

			if (!session?.user?.id) {
				console.error("❌ 로그인된 사용자가 없습니다.");
				return {
					errors: {
						general: "로그인이 필요합니다. 다시 로그인해주세요.",
					},
				};
			}

			userId = session.user.id;
			console.log("📋 세션에서 가져온 사용자 ID:", userId);
		}

		// Drizzle ORM으로 성향 평가 결과 저장
		const db = (await import("~/core/db/drizzle-client.server")).default;
		const { personalityAssessments } = await import("~/core/db/schema");

		const assessmentData = {
			user_id: userId,
			status: "completed" as const,
			choice_answers: validatedChoiceAnswers,
			scale_answers: validatedScaleAnswers,
			personality_traits: personalityTraits,
			mbti_type: null, // TODO: MBTI 타입 계산 로직 추가
			primary_traits: null, // TODO: 주요 특성 계산 로직 추가
			description: null, // TODO: 설명 생성 로직 추가
			recommended_activities: null, // TODO: 추천 활동 생성 로직 추가
			completed_at: new Date(),
		};

		const [savedAssessment] = await db
			.insert(personalityAssessments)
			.values(assessmentData)
			.returning();

		console.log("✅ 성향 평가 저장 성공:", savedAssessment);

		// 성공 시 홈으로 리다이렉트
		return redirect("/");
	} catch (error) {
		console.error("성향 평가 저장 오류:", error);
		return {
			errors: {
				general:
					"성향 평가 저장 중 오류가 발생했습니다. 다시 시도해주세요.",
			},
		};
	}
}

export function loader({ request }: LoaderFunctionArgs) {
	return {};
}

export const meta: MetaFunction = () => [
	{ title: "성향 평가 - HereNow" },
	{
		name: "description",
		content: "당신의 성향을 파악해서 더 좋은 매칭을 도와드려요",
	},
];

// 1-30번 선택형 문항들
const CHOICE_QUESTIONS = [
	{
		id: 1,
		question: "주말 계획을 어떻게 세우는 편인가요?",
		options: [
			"미리미리 뭐 할지 다 정해놔야 해요",
			"그때그때 기분 따라 정하는 게 좋아요",
		],
	},
	{
		id: 2,
		question: "친구가 고민 상담을 할 때 어떻게 반응하나요?",
		options: [
			"해결책부터 찾아서 알려줘요",
			"일단 마음 다 들어주고 공감해줘요",
		],
	},
	{
		id: 3,
		question: "버스나 지하철에서 자리가 하나 남았을 때 어떻게 하나요?",
		options: ["빨리 가서 앉아요", "다른 사람 먼저 앉으라고 해요"],
	},
	{
		id: 4,
		question: "회사 회식 소식을 들으면 기분이 어때요?",
		options: [
			"좋아요! 사람들이랑 놀 시간이에요",
			"아... 집에 가고 싶은데요",
		],
	},
	{
		id: 5,
		question: "어떤 장르의 영화를 더 좋아하나요?",
		options: [
			"스릴러, 액션 같은 자극적인 거",
			"로맨스, 힐링 되는 잔잔한 거",
		],
	},
	{
		id: 6,
		question: "친구가 갑자기 만나자고 하면 어떻게 반응하나요?",
		options: ["좋아요! 바로 나갈게요", "어... 오늘은 좀 힘들 것 같아요"],
	},
	{
		id: 7,
		question: "새로운 앱을 사용할 때 어떤 방식으로 익히나요?",
		options: ["일단 눌러보면서 익혀요", "사용법부터 찾아보고 써요"],
	},
	{
		id: 8,
		question: "장보러 갈 때 어떤 스타일인가요?",
		options: [
			"리스트 적어서 필요한 것만 사요",
			"돌아다니면서 눈에 띄는 거 골라요",
		],
	},
	{
		id: 9,
		question: "본인 방 상태는 어떤 편인가요?",
		options: ["깔끔하게 정리되어 있어요", "좀 어수선해도 괜찮아요"],
	},
	{
		id: 10,
		question: "새로운 취미를 시작한다면 어떤 걸 선택할까요?",
		options: ["혼자서도 할 수 있는 거", "사람들이랑 같이 하는 거"],
	},
	{
		id: 11,
		question: "친구들 모임에서는 주로 어떤 역할을 하나요?",
		options: ["분위기 메이커 역할을 해요", "조용히 듣고 있는 편이에요"],
	},
	{
		id: 12,
		question: "일할 때 어디서 하는 게 더 집중이 잘 되나요?",
		options: ["조용한 곳에서 혼자", "사람들이 있는 곳에서 같이"],
	},
	{
		id: 13,
		question: "점심 메뉴를 정할 때 어떤 성향인가요?",
		options: ["늘 먹던 거 먹을래요", "새로운 거 먹어볼래요"],
	},
	{
		id: 14,
		question: "스마트폰 배경화면은 주로 어떤 걸로 설정하나요?",
		options: ["깔끔한 단색이나 심플한 거", "내가 좋아하는 사진이나 캐릭터"],
	},
	{
		id: 15,
		question: "친구 결혼식에 갈 때 어떤 옷을 입고 가나요?",
		options: ["정장 깔끔하게 입고 가요", "좀 독특하고 예쁜 옷 입고 가요"],
	},
	{
		id: 16,
		question: "카톡 메시지를 받으면 언제 답장하나요?",
		options: ["바로바로 답장하는 편이에요", "시간 날 때 몰아서 답장해요"],
	},
	{
		id: 17,
		question: "맛집을 어떻게 찾는 편인가요?",
		options: [
			"리뷰 많이 찾아보고 가요",
			"그냥 지나가다 끌리는 곳 들어가요",
		],
	},
	{
		id: 18,
		question: "친구가 늦는다고 연락하면 어떤 기분인가요?",
		options: ["괜찮다고 하면서 기다려요", "속으로 좀 답답해요"],
	},
	{
		id: 19,
		question: "새로운 동네로 이사를 간다면 기분이 어떨까요?",
		options: ["설레고 기대돼요", "걱정되고 불안해요"],
	},
	{
		id: 20,
		question: "온라인 쇼핑을 할 때 어떤 스타일인가요?",
		options: [
			"후기 다 읽어보고 신중하게 사요",
			"마음에 들면 바로 결제해요",
		],
	},
	{
		id: 21,
		question: "화가 났을 때 어떻게 표현하나요?",
		options: ["바로 표현하고 풀어버려요", "혼자 삭히는 편이에요"],
	},
	{
		id: 22,
		question: "데이트 코스를 정할 때 어떤 방식을 선호하나요?",
		options: [
			"내가 계획 다 세워서 리드해요",
			"상대방 의견 물어보고 맞춰가요",
		],
	},
	{
		id: 23,
		question: "친구 생일선물을 고를 때 어떤 기준으로 선택하나요?",
		options: ["실용적으로 쓸 수 있는 거", "예쁘고 기념품 같은 거"],
	},
	{
		id: 24,
		question: "드라마나 예능을 볼 때 어떤 방식으로 보나요?",
		options: ["몰아보기로 한 번에 다 봐요", "조금씩 나눠서 천천히 봐요"],
	},
	{
		id: 25,
		question: "새로운 사람들 앞에서는 어떤 모습인가요?",
		options: [
			"먼저 말 걸고 친해지려고 해요",
			"어색해서 말 걸기가 힘들어요",
		],
	},
	{
		id: 26,
		question: "야근을 해야 할 때 평소 어떤 패턴인가요?",
		options: ["미리미리 해서 안 하려고 해요", "마감 임박해서 몰아서 해요"],
	},
	{
		id: 27,
		question: "친구가 고민을 얘기할 때 주로 어떻게 반응하나요?",
		options: [
			"그래서 어떻게 할 거야? 물어봐요",
			"정말 힘들겠다 하면서 들어줘요",
		],
	},
	{
		id: 28,
		question: "휴가 계획은 언제 세우는 편인가요?",
		options: ["몇 달 전부터 미리 계획해요", "휴가 직전에 급하게 정해요"],
	},
	{
		id: 29,
		question: "사람 많은 곳에 가면 어떤 기분인가요?",
		options: ["에너지가 생기고 신나요", "피곤하고 빨리 나가고 싶어요"],
	},
	{
		id: 30,
		question: "일이나 공부를 할 때 어디서 하는 게 좋을까요?",
		options: [
			"조용한 카페나 도서관이 좋아요",
			"집에서 편하게 하는 게 좋아요",
		],
	},
];

// 31-40번 점수형 문항들
const SCALE_QUESTIONS = [
	{
		id: 31,
		question: "나는 사소한 것도 금방 감동받는 편이다",
		leftEmoji: "😐",
		rightEmoji: "🥺",
	},
	{
		id: 32,
		question: "내 감정을 사람들한테 표현하는 게 자연스럽다",
		leftEmoji: "🤐",
		rightEmoji: "😊",
	},
	{
		id: 33,
		question: "상황에 따라 내 역할을 유연하게 바꾸는 편이다",
		leftEmoji: "😤",
		rightEmoji: "🤸‍♀️",
	},
	{
		id: 34,
		question: "새로운 변화가 생기면 오히려 신난다",
		leftEmoji: "😰",
		rightEmoji: "🤩",
	},
	{
		id: 35,
		question: "혼자만의 시간이 꼭 필요하다고 느낀다",
		leftEmoji: "👥",
		rightEmoji: "🧘‍♀️",
	},
	{
		id: 36,
		question: "나는 내 생각이나 신념이 꽤 뚜렷한 편이다",
		leftEmoji: "🤷‍♀️",
		rightEmoji: "💪",
	},
	{
		id: 37,
		question: "사람들에게 영향을 주거나 끼치는 게 좋다",
		leftEmoji: "🙈",
		rightEmoji: "🌟",
	},
	{
		id: 38,
		question: "계획 없이도 즉흥적으로 결정하는 일이 많다",
		leftEmoji: "📋",
		rightEmoji: "🎲",
	},
	{
		id: 39,
		question: "평소에 나 자신에 대해 이것저것 자주 생각한다",
		leftEmoji: "🤯",
		rightEmoji: "🤔",
	},
	{
		id: 40,
		question: "매일 비슷한 일상이 오히려 마음 편하다",
		leftEmoji: "🌪️",
		rightEmoji: "☕",
	},
];

export default function Question() {
	const [currentQuestion, setCurrentQuestion] = useState(1);
	const [choiceAnswers, setChoiceAnswers] = useState<{
		[key: number]: number;
	}>({});
	const [scaleAnswers, setScaleAnswers] = useState<{ [key: number]: number }>(
		{}
	);

	const totalQuestions = CHOICE_QUESTIONS.length + SCALE_QUESTIONS.length;
	const isChoiceQuestion = currentQuestion <= 30;
	const isScaleQuestion = currentQuestion > 30;

	// 선택형 질문 답변 처리
	const handleChoiceAnswer = (optionIndex: number) => {
		setChoiceAnswers((prev) => ({
			...prev,
			[currentQuestion]: optionIndex,
		}));

		// 자동으로 다음 질문으로 이동
		if (currentQuestion < totalQuestions) {
			setTimeout(() => {
				setCurrentQuestion((prev) => prev + 1);
			}, 300);
		}
	};

	// 점수형 질문 답변 처리
	const handleScaleAnswer = (score: number) => {
		setScaleAnswers((prev) => ({
			...prev,
			[currentQuestion]: score,
		}));

		// 자동으로 다음 질문으로 이동
		if (currentQuestion < totalQuestions) {
			setTimeout(() => {
				setCurrentQuestion((prev) => prev + 1);
			}, 300);
		}
	};

	// 이전 질문으로
	const prevQuestion = () => {
		if (currentQuestion > 1) {
			setCurrentQuestion((prev) => prev - 1);
		}
	};

	// 다음 질문으로
	const nextQuestion = () => {
		if (currentQuestion < totalQuestions) {
			setCurrentQuestion((prev) => prev + 1);
		}
	};

	// 현재 질문이 답변되었는지 확인
	const isCurrentQuestionAnswered = () => {
		if (isChoiceQuestion) {
			return choiceAnswers[currentQuestion] !== undefined;
		} else {
			return scaleAnswers[currentQuestion] !== undefined;
		}
	};

	// 모든 질문이 답변되었는지 확인
	const isAllQuestionsAnswered = () => {
		return (
			Object.keys(choiceAnswers).length === 30 &&
			Object.keys(scaleAnswers).length === 10
		);
	};

	const getCurrentQuestionData = () => {
		if (isChoiceQuestion) {
			return CHOICE_QUESTIONS[currentQuestion - 1];
		} else {
			return SCALE_QUESTIONS[currentQuestion - 31];
		}
	};

	const questionData = getCurrentQuestionData();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
			<div className="mx-auto max-w-2xl">
				{/* 헤더 */}
				<div className="text-center mb-8">
					<Link
						to="/"
						className="inline-flex items-center font-bold tracking-tighter text-2xl mb-6 text-blue-600"
					>
						<Heart className="w-6 h-6 mr-2" />
						HereNow
					</Link>

					<h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
						당신을 더 알아가는
						<br />
						<span className="text-blue-600">시간이에요</span>
					</h1>
					<p className="text-gray-600 text-lg">
						성향을 파악해서 더 좋은 매칭을 도와드릴게요
					</p>
				</div>

				{/* 진행률 표시 */}
				<div className="mb-8">
					<div className="flex justify-between items-center mb-3">
						<span className="text-sm text-gray-600">
							질문 {currentQuestion} / {totalQuestions}
						</span>
						<span className="text-sm text-gray-600">
							{Math.round(
								(currentQuestion / totalQuestions) * 100
							)}
							% 완료
						</span>
					</div>
					<div className="h-2 bg-gray-200 rounded-full">
						<div
							className="h-2 bg-blue-500 rounded-full transition-all duration-500"
							style={{
								width: `${
									(currentQuestion / totalQuestions) * 100
								}%`,
							}}
						/>
					</div>
				</div>

				{/* 메인 카드 */}
				<Card className="shadow-lg">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl text-gray-900">
							{questionData?.question}
						</CardTitle>
						<CardDescription className="text-gray-600 text-lg">
							{isChoiceQuestion
								? "더 가까운 답변을 선택해주세요"
								: "1점(전혀 아니야)부터 10점(완전 그렇지)까지 선택해주세요"}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* 선택형 질문 (1-30번) */}
						{isChoiceQuestion &&
							questionData &&
							"options" in questionData && (
								<div className="space-y-4">
									{questionData.options.map(
										(option, index) => (
											<div
												key={index}
												className="relative"
											>
												<Button
													type="button"
													variant="outline"
													onClick={() =>
														handleChoiceAnswer(
															index
														)
													}
													className={`w-full p-6 h-auto text-left justify-start transition-all duration-300 ${
														choiceAnswers[
															currentQuestion
														] === index
															? "bg-blue-50 border-blue-500 text-blue-900"
															: "hover:bg-gray-50"
													}`}
												>
													<div className="flex items-center w-full">
														<div className="flex-1 text-lg">
															{option}
														</div>
														{choiceAnswers[
															currentQuestion
														] === index && (
															<CheckCircle className="w-6 h-6 ml-4 text-blue-600" />
														)}
													</div>
												</Button>
											</div>
										)
									)}
								</div>
							)}

						{/* 점수형 질문 (31-40번) */}
						{isScaleQuestion &&
							questionData &&
							"leftEmoji" in questionData && (
								<div className="space-y-6">
									{/* 이모티콘과 설명 */}
									<div className="flex justify-between items-center px-4">
										<div className="text-center">
											<div className="text-3xl mb-2">
												{questionData.leftEmoji}
											</div>
											<div className="text-sm text-gray-500">
												전혀 아니야
											</div>
										</div>
										<div className="text-center">
											<div className="text-3xl mb-2">
												{questionData.rightEmoji}
											</div>
											<div className="text-sm text-gray-500">
												완전 그렇지
											</div>
										</div>
									</div>

									{/* 점수 선택 버튼들 */}
									<div className="space-y-4">
										{/* 1-5점 */}
										<div className="grid grid-cols-5 gap-3">
											{[1, 2, 3, 4, 5].map((score) => (
												<Button
													key={score}
													type="button"
													variant="outline"
													onClick={() =>
														handleScaleAnswer(score)
													}
													className={`h-12 w-full text-lg font-semibold transition-all duration-300 ${
														scaleAnswers[
															currentQuestion
														] === score
															? "bg-red-500 text-white border-red-500 shadow-lg transform scale-105"
															: "hover:bg-gray-50 hover:scale-105"
													}`}
												>
													{score}
												</Button>
											))}
										</div>

										{/* 6-10점 */}
										<div className="grid grid-cols-5 gap-3">
											{[6, 7, 8, 9, 10].map((score) => (
												<Button
													key={score}
													type="button"
													variant="outline"
													onClick={() =>
														handleScaleAnswer(score)
													}
													className={`h-12 w-full text-lg font-semibold transition-all duration-300 ${
														scaleAnswers[
															currentQuestion
														] === score
															? "bg-green-500 text-white border-green-500 shadow-lg transform scale-105"
															: "hover:bg-gray-50 hover:scale-105"
													}`}
												>
													{score}
												</Button>
											))}
										</div>
									</div>
								</div>
							)}

						{/* 네비게이션 버튼 */}
						<div className="flex justify-between pt-6">
							{currentQuestion > 1 ? (
								<Button
									type="button"
									variant="outline"
									onClick={prevQuestion}
									className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
								>
									<ChevronLeft className="w-4 h-4 mr-2" />
									이전
								</Button>
							) : (
								<div />
							)}

							{currentQuestion < totalQuestions ? (
								<Button
									type="button"
									onClick={nextQuestion}
									disabled={!isCurrentQuestionAnswered()}
									className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
								>
									다음
									<ChevronRight className="w-4 h-4 ml-2" />
								</Button>
							) : (
								<Form method="post">
									<input
										type="hidden"
										name="choiceAnswers"
										value={JSON.stringify(choiceAnswers)}
									/>
									<input
										type="hidden"
										name="scaleAnswers"
										value={JSON.stringify(scaleAnswers)}
									/>

									<Button
										type="submit"
										disabled={!isAllQuestionsAnswered()}
										className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<Heart className="w-5 h-5 mr-2" />
										완료하기
										<ArrowRight className="w-5 h-5 ml-2" />
									</Button>
								</Form>
							)}
						</div>
					</CardContent>
				</Card>

				{/* 진행 상황 표시 */}
				<div className="text-center mt-8">
					<p className="text-gray-500 text-sm">
						{isChoiceQuestion ? "선택형 질문" : "점수형 질문"} •
						{isChoiceQuestion
							? ` ${currentQuestion}/30`
							: ` ${currentQuestion - 30}/10`}
					</p>
				</div>
			</div>
		</div>
	);
}
