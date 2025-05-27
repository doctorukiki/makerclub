import { useState } from "react";
import { Link, Form, redirect } from "react-router";
import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
} from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import {
	ChevronLeft,
	ChevronRight,
	Users,
	MapPin,
	Heart,
	Coffee,
	Camera,
	Music,
	Utensils,
	Book,
} from "lucide-react";

// 서버 액션 - 회원가입 처리
export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();

	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const name = formData.get("name") as string;
	// const bio = formData.get("bio") as string;
	const userType = formData.get("userType") as string;
	const interests = JSON.parse(formData.get("interests") as string);
	const languages = JSON.parse(formData.get("languages") as string);
	const location = formData.get("location") as string;
	const marketingConsent = formData.get("marketingConsent") === "true";

	// 기본 유효성 검사
	const errors: { [key: string]: string } = {};

	if (!email || !email.includes("@")) {
		errors.email = "유효한 이메일을 입력해주세요";
	}

	if (!password || password.length < 8) {
		errors.password = "비밀번호는 8자 이상이어야 합니다";
	}

	if (!name || name.trim().length < 2) {
		errors.name = "이름은 2자 이상이어야 합니다";
	}

	if (Object.keys(errors).length > 0) {
		return { errors };
	}

	try {
		// TODO: Supabase 인증 및 프로필 생성 로직 구현
		// 1. Supabase Auth 사용자 생성
		// 2. profiles 테이블에 추가 정보 저장

		console.log("회원가입 데이터:", {
			email,
			name,
			// bio,
			userType,
			interests,
			languages,
			location,
			marketingConsent,
		});

		// 회원가입 성공 시 성향 평가 페이지로 리다이렉트
		return redirect("/question");
	} catch (error) {
		console.error("회원가입 오류:", error);
		return {
			errors: {
				general: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
			},
		};
	}
}

export function loader({ request }: LoaderFunctionArgs) {
	return {};
}

export const meta: MetaFunction = () => [
	{ title: "회원가입 - HereNow" },
	{
		name: "description",
		content: "HereNow에서 새로운 여행과 만남을 시작하세요",
	},
];

interface ActionData {
	errors?: {
		email?: string;
		password?: string;
		name?: string;
		general?: string;
	};
}

// 관심사 옵션들
const INTERESTS = [
	{ id: "food", label: "음식", icon: Utensils },
	{ id: "coffee", label: "커피", icon: Coffee },
	{ id: "culture", label: "문화", icon: Book },
	{ id: "photography", label: "사진", icon: Camera },
	{ id: "music", label: "음악", icon: Music },
	{ id: "nightlife", label: "나이트라이프", icon: Heart },
	{ id: "shopping", label: "쇼핑", icon: MapPin },
	{ id: "nature", label: "자연", icon: MapPin },
	{ id: "art", label: "예술", icon: Book },
	{ id: "sports", label: "스포츠", icon: Users },
	{ id: "language", label: "언어교환", icon: Users },
	{ id: "local_life", label: "현지생활", icon: Heart },
];

// 언어 옵션들
const LANGUAGES = [
	{ code: "ko", label: "한국어" },
	{ code: "en", label: "English" },
	{ code: "ja", label: "日本語" },
	{ code: "zh", label: "中文" },
	{ code: "es", label: "Español" },
	{ code: "fr", label: "Français" },
];

export default function Signup() {
	// 다단계 폼 상태
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
		bio: "",
		userType: "",
		interests: [] as string[],
		languages: [] as string[],
		location: "",
		marketingConsent: false,
	});

	// 폼 데이터 업데이트
	const updateFormData = (updates: Partial<typeof formData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
	};

	// 관심사 토글
	const toggleInterest = (interestId: string) => {
		const newInterests = formData.interests.includes(interestId)
			? formData.interests.filter((id) => id !== interestId)
			: [...formData.interests, interestId];
		updateFormData({ interests: newInterests });
	};

	// 언어 토글
	const toggleLanguage = (languageCode: string) => {
		const newLanguages = formData.languages.includes(languageCode)
			? formData.languages.filter((code) => code !== languageCode)
			: [...formData.languages, languageCode];
		updateFormData({ languages: newLanguages });
	};

	// 다음 단계로
	const nextStep = () => {
		if (step < 5) setStep(step + 1);
	};

	// 이전 단계로
	const prevStep = () => {
		if (step > 1) setStep(step - 1);
	};

	// 단계별 유효성 검사
	const isStepValid = () => {
		switch (step) {
			case 1:
				return formData.userType !== "";
			case 2:
				return (
					formData.email &&
					formData.password &&
					formData.confirmPassword &&
					formData.name &&
					formData.password === formData.confirmPassword
				);
			case 3:
				return formData.location !== "";
			case 4:
				return formData.interests.length > 0;
			case 5:
				return formData.languages.length > 0;
			default:
				return false;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
			<div className="mx-auto max-w-md">
				{/* 진행률 표시 */}
				<div className="mb-8">
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm text-gray-600">
							단계 {step} / 5
						</span>
						<span className="text-sm text-gray-600">
							{Math.round((step / 5) * 100)}% 완료
						</span>
					</div>
					<div className="h-2 bg-gray-200 rounded-full">
						<div
							className="h-2 bg-blue-500 rounded-full transition-all duration-300"
							style={{ width: `${(step / 5) * 100}%` }}
						/>
					</div>
				</div>

				<Card>
					<CardHeader className="text-center">
						<CardTitle>HereNow에 오신 것을 환영합니다!</CardTitle>
						<CardDescription>
							{step === 1 &&
								"어떤 유형의 사용자인지 선택해주세요"}
							{step === 2 && "기본 정보를 입력해주세요"}
							{step === 3 && "위치 정보를 설정해주세요"}
							{step === 4 && "관심사를 선택해주세요"}
							{step === 5 && "사용 가능한 언어를 선택해주세요"}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-6">
						{/* 1단계: 사용자 유형 선택 */}
						{step === 1 && (
							<div className="space-y-4">
								<RadioGroup
									value={formData.userType}
									onValueChange={(value: string) =>
										updateFormData({ userType: value })
									}
									className="space-y-3"
								>
									<div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
										<RadioGroupItem
											value="traveler"
											id="traveler"
										/>
										<Label
											htmlFor="traveler"
											className="flex-1 cursor-pointer"
										>
											<div>
												<div className="font-medium">
													여행자
												</div>
												<div className="text-sm text-gray-500">
													새로운 도시에서 현지인과
													만나고 싶어요
												</div>
											</div>
										</Label>
									</div>

									<div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
										<RadioGroupItem
											value="local_host"
											id="local_host"
										/>
										<Label
											htmlFor="local_host"
											className="flex-1 cursor-pointer"
										>
											<div>
												<div className="font-medium">
													현지 호스트
												</div>
												<div className="text-sm text-gray-500">
													여행자들과 만나서 우리
													동네를 소개하고 싶어요
												</div>
											</div>
										</Label>
									</div>
								</RadioGroup>
							</div>
						)}

						{/* 2단계: 기본 정보 입력 */}
						{step === 2 && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">이메일</Label>
									<Input
										id="email"
										name="email"
										type="email"
										value={formData.email}
										onChange={(
											e: React.ChangeEvent<HTMLInputElement>
										) =>
											updateFormData({
												email: e.target.value,
											})
										}
										placeholder="your@email.com"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="name">이름</Label>
									<Input
										id="name"
										name="name"
										value={formData.name}
										onChange={(
											e: React.ChangeEvent<HTMLInputElement>
										) =>
											updateFormData({
												name: e.target.value,
											})
										}
										placeholder="프로필에 표시될 이름"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="password">비밀번호</Label>
									<Input
										id="password"
										name="password"
										type="password"
										value={formData.password}
										onChange={(
											e: React.ChangeEvent<HTMLInputElement>
										) =>
											updateFormData({
												password: e.target.value,
											})
										}
										placeholder="8자 이상 입력해주세요"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="confirmPassword">
										비밀번호 확인
									</Label>
									<Input
										id="confirmPassword"
										type="password"
										value={formData.confirmPassword}
										onChange={(
											e: React.ChangeEvent<HTMLInputElement>
										) =>
											updateFormData({
												confirmPassword: e.target.value,
											})
										}
										placeholder="비밀번호를 다시 입력해주세요"
										required
									/>
									{formData.password &&
										formData.confirmPassword &&
										formData.password !==
											formData.confirmPassword && (
											<p className="text-sm text-red-600">
												비밀번호가 일치하지 않습니다
											</p>
										)}
								</div>

								{/* <div className="space-y-2">
									<Label htmlFor="bio">자기소개 (선택)</Label>
									<Textarea
										id="bio"
										value={formData.bio}
										onChange={(
											e: React.ChangeEvent<HTMLTextAreaElement>
										) =>
											updateFormData({
												bio: e.target.value,
											})
										}
										placeholder="자신을 간단히 소개해보세요"
										rows={3}
									/>
								</div> */}
							</div>
						)}

						{/* 3단계: 위치 설정 */}
						{step === 3 && (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="location">현재 위치</Label>
									<Input
										id="location"
										value={formData.location}
										onChange={(
											e: React.ChangeEvent<HTMLInputElement>
										) =>
											updateFormData({
												location: e.target.value,
											})
										}
										placeholder="예: 서울, 강남구"
										required
									/>
									<p className="text-sm text-gray-500">
										{formData.userType === "traveler"
											? "여행 중인 도시나 지역을 입력해주세요"
											: "거주하고 있는 도시나 지역을 입력해주세요"}
									</p>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox
										id="marketing"
										checked={formData.marketingConsent}
										onCheckedChange={(checked: boolean) =>
											updateFormData({
												marketingConsent: checked,
											})
										}
									/>
									<Label
										htmlFor="marketing"
										className="text-sm"
									>
										마케팅 정보 수신에 동의합니다 (선택)
									</Label>
								</div>
							</div>
						)}

						{/* 4단계: 관심사 선택 */}
						{step === 4 && (
							<div className="space-y-6">
								<div>
									<Label className="text-base font-medium">
										관심사 선택
									</Label>
									<p className="text-sm text-gray-500 mb-3">
										함께 즐기고 싶은 활동들을 선택해주세요
									</p>
									<div className="grid grid-cols-2 gap-2">
										{INTERESTS.map(
											({ id, label, icon: Icon }) => (
												<Button
													key={id}
													type="button"
													variant={
														formData.interests.includes(
															id
														)
															? "default"
															: "outline"
													}
													size="sm"
													onClick={() =>
														toggleInterest(id)
													}
													className="justify-start h-auto p-3"
												>
													<Icon className="w-4 h-4 mr-2" />
													{label}
												</Button>
											)
										)}
									</div>
								</div>
							</div>
						)}

						{/* 5단계: 언어 선택 및 최종 정보 요약 */}
						{step === 5 && (
							<div className="space-y-6">
								<div>
									<Label className="text-base font-medium">
										사용 가능한 언어
									</Label>
									<p className="text-sm text-gray-500 mb-3">
										대화할 수 있는 언어를 선택해주세요
									</p>
									<div className="grid grid-cols-2 gap-2">
										{LANGUAGES.map(({ code, label }) => (
											<Button
												key={code}
												type="button"
												variant={
													formData.languages.includes(
														code
													)
														? "default"
														: "outline"
												}
												size="sm"
												onClick={() =>
													toggleLanguage(code)
												}
												className="justify-center"
											>
												{label}
											</Button>
										))}
									</div>
								</div>

								{/* 최종 정보 요약 */}
								<div className="mt-6 p-4 bg-gray-50 rounded-lg">
									<h4 className="font-medium mb-2">
										입력하신 정보
									</h4>
									<div className="space-y-1 text-sm">
										<p>
											<strong>유형:</strong>{" "}
											{formData.userType === "traveler"
												? "여행자"
												: "현지 호스트"}
										</p>
										<p>
											<strong>이름:</strong>{" "}
											{formData.name}
										</p>
										<p>
											<strong>이메일:</strong>{" "}
											{formData.email}
										</p>
										<p>
											<strong>위치:</strong>{" "}
											{formData.location}
										</p>
										<p>
											<strong>관심사:</strong>{" "}
											{formData.interests
												.map(
													(id) =>
														INTERESTS.find(
															(i) => i.id === id
														)?.label
												)
												.join(", ")}
										</p>
										<p>
											<strong>언어:</strong>{" "}
											{formData.languages
												.map(
													(code) =>
														LANGUAGES.find(
															(l) =>
																l.code === code
														)?.label
												)
												.join(", ")}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* 네비게이션 버튼 */}
						<div className="flex justify-between pt-4">
							{step > 1 ? (
								<Button
									type="button"
									variant="outline"
									onClick={prevStep}
								>
									<ChevronLeft className="w-4 h-4 mr-2" />
									이전
								</Button>
							) : (
								<div />
							)}

							{step < 5 ? (
								<Button
									type="button"
									onClick={nextStep}
									disabled={!isStepValid()}
								>
									다음
									<ChevronRight className="w-4 h-4 ml-2" />
								</Button>
							) : (
								<Form method="post">
									{/* 모든 폼 데이터를 hidden input으로 전송 */}
									<input
										type="hidden"
										name="email"
										value={formData.email}
									/>
									<input
										type="hidden"
										name="password"
										value={formData.password}
									/>
									<input
										type="hidden"
										name="name"
										value={formData.name}
									/>
									{/* <input
										type="hidden"
										name="bio"
										value={formData.bio}
									/> */}
									<input
										type="hidden"
										name="userType"
										value={formData.userType}
									/>
									<input
										type="hidden"
										name="interests"
										value={JSON.stringify(
											formData.interests
										)}
									/>
									<input
										type="hidden"
										name="languages"
										value={JSON.stringify(
											formData.languages
										)}
									/>
									<input
										type="hidden"
										name="location"
										value={formData.location}
									/>
									<input
										type="hidden"
										name="marketingConsent"
										value={formData.marketingConsent.toString()}
									/>

									<Button type="submit">가입 완료</Button>
								</Form>
							)}
						</div>

						{/* 에러 메시지 */}
						{/* {actionData?.errors?.general && (
							<div className="text-center">
								<p className="text-sm text-red-600">
									{actionData.errors.general}
								</p>
							</div>
						)} */}
					</CardContent>
				</Card>

				{/* 로그인 링크 */}
				<div className="text-center mt-6">
					<p className="text-sm text-gray-600">
						이미 계정이 있으신가요?{" "}
						<Link
							to="/login"
							className="text-blue-600 hover:underline"
						>
							로그인하기
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
