import { useState } from "react";
import { Link, Form, redirect, useNavigation } from "react-router";
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
	Sparkles,
	Zap,
	Globe,
	Star,
	Loader2,
	Chrome,
} from "lucide-react";
import { BorderBeam } from "components/magicui/border-beam";

import { GoogleLogo } from "~/components/logos/google";
import { KakaoLogo } from "~/components/logos/kakao";

// 서버 액션 - 회원가입 처리
export async function action({ request }: ActionFunctionArgs) {
	console.log("🚀 Action 함수가 호출되었습니다!");

	const formData = await request.formData();
	console.log("📝 FormData 받음:", Object.fromEntries(formData.entries()));

	const action = formData.get("action") as string;

	// 소셜 로그인 처리
	if (action === "social_login") {
		const provider = formData.get("provider") as string;
		console.log(`🔗 ${provider} 소셜 로그인 처리 시작`);

		try {
			const { supabase } = await import("~/lib/supabase.server");

			const redirectUrl = new URL(request.url).origin + "/auth/callback";

			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: provider as "google" | "kakao",
				options: {
					redirectTo: redirectUrl,
					queryParams: {
						access_type: "offline",
						prompt: "consent",
					},
				},
			});

			if (error) {
				console.error(`❌ ${provider} 소셜 로그인 오류:`, error);
				return Response.json({ error: error.message }, { status: 400 });
			}

			if (data.url) {
				console.log(`✅ ${provider} OAuth URL 생성 성공:`, data.url);
				return Response.json({ redirectUrl: data.url });
			}

			return Response.json(
				{ error: "OAuth URL 생성 실패" },
				{ status: 400 }
			);
		} catch (error) {
			console.error(`❌ ${provider} 소셜 로그인 처리 중 오류:`, error);
			return Response.json(
				{ error: "소셜 로그인 처리 중 오류가 발생했습니다." },
				{ status: 500 }
			);
		}
	}

	// 기존 이메일 회원가입 처리
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const name = formData.get("name") as string;
	const userType = formData.get("userType") as string;
	const interests = JSON.parse(formData.get("interests") as string);
	const languages = JSON.parse(formData.get("languages") as string);
	const location = formData.get("location") as string;
	const marketingConsent = formData.get("marketingConsent") === "true";

	console.log("✅ 파싱된 데이터:", {
		email,
		name,
		userType,
		interests,
		languages,
		location,
		marketingConsent,
	});

	// 기본 유효성 검사
	const errors: { [key: string]: string } = {};

	if (!email || !email.includes("@")) {
		errors.email = "유효한 이메일을 입력해주세요";
		console.log("❌ 이메일 유효성 검사 실패:", email);
	}

	if (!password || password.length < 8) {
		errors.password = "비밀번호는 8자 이상이어야 합니다";
		console.log("❌ 비밀번호 유효성 검사 실패:", {
			password,
			length: password?.length,
		});
	}

	if (!name || name.trim().length < 2) {
		errors.name = "이름은 2자 이상이어야 합니다";
		console.log("❌ 이름 유효성 검사 실패:", name);
	}

	if (!userType || !["traveler", "local_host"].includes(userType)) {
		errors.userType = "사용자 유형을 선택해주세요";
		console.log("❌ 사용자 유형 유효성 검사 실패:", userType);
	}

	if (!interests || interests.length === 0) {
		errors.interests = "관심사를 하나 이상 선택해주세요";
		console.log("❌ 관심사 유효성 검사 실패:", interests);
	}

	if (!languages || languages.length === 0) {
		errors.languages = "언어를 하나 이상 선택해주세요";
		console.log("❌ 언어 유효성 검사 실패:", languages);
	}

	if (!location || location.trim().length < 2) {
		errors.location = "위치를 입력해주세요";
		console.log("❌ 위치 유효성 검사 실패:", location);
	}

	console.log("🔍 유효성 검사 결과:", {
		errors,
		hasErrors: Object.keys(errors).length > 0,
	});

	if (Object.keys(errors).length > 0) {
		console.log("❌ 유효성 검사 실패로 인한 조기 반환");
		return { errors };
	}

	try {
		// auth.server.ts의 signUp 함수 사용
		const { signUp } = await import("~/lib/auth.server");

		const signupData = {
			email,
			password,
			name: name.trim(),
			userType: userType as "traveler" | "local_host",
			interests,
			languages,
			location: location.trim(),
			marketingConsent,
		};

		console.log("📤 회원가입 시도 중...", signupData);

		const result = await signUp(signupData);

		if (result.success) {
			console.log("🎉 회원가입 성공!", {
				userId: result.user?.id,
				email: result.user?.email,
			});

			console.log("🔄 /question_glow로 리다이렉트 시도 중...");

			// 세션 쿠키 설정
			const headers = new Headers();
			if (result.session) {
				const { createSessionCookie } = await import(
					"~/lib/supabase.server"
				);
				const sessionCookie = createSessionCookie(result.session);
				if (sessionCookie) {
					headers.append("Set-Cookie", sessionCookie);
				}
			}

			// 성공 시 성향 평가 페이지로 리다이렉트 (사용자 ID 포함)
			return redirect(`/question_glow?userId=${result.user?.id}`, {
				headers,
			});
		} else {
			console.log("❌ 회원가입 실패:", result.error);
			return {
				errors: {
					general: result.error || "회원가입에 실패했습니다.",
				},
			};
		}
	} catch (error) {
		console.error("❌ 회원가입 처리 중 예상치 못한 오류:", error);
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
	{ title: "회원가입 - Here&Now" },
	{
		name: "description",
		content: "Here&Now에서 새로운 여행과 만남을 시작하세요",
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
	{
		id: "food",
		label: "음식",
		icon: Utensils,
		color: "from-orange-500 to-red-500",
	},
	{
		id: "coffee",
		label: "커피",
		icon: Coffee,
		color: "from-amber-500 to-orange-500",
	},
	{
		id: "culture",
		label: "문화",
		icon: Book,
		color: "from-purple-500 to-pink-500",
	},
	{
		id: "photography",
		label: "사진",
		icon: Camera,
		color: "from-blue-500 to-cyan-500",
	},
	// {
	// 	id: "music",
	// 	label: "음악",
	// 	icon: Music,
	// 	color: "from-pink-500 to-rose-500",
	// },
	{
		id: "nightlife",
		label: "나이트라이프",
		icon: Heart,
		color: "from-violet-500 to-purple-500",
	},
	{
		id: "shopping",
		label: "쇼핑",
		icon: MapPin,
		color: "from-emerald-500 to-teal-500",
	},
	// {
	// 	id: "nature",
	// 	label: "자연",
	// 	icon: MapPin,
	// 	color: "from-green-500 to-emerald-500",
	// },
	{
		id: "art",
		label: "예술",
		icon: Book,
		color: "from-indigo-500 to-purple-500",
	},
	{
		id: "sports",
		label: "스포츠",
		icon: Users,
		color: "from-red-500 to-pink-500",
	},
	{
		id: "language",
		label: "언어교환",
		icon: Users,
		color: "from-cyan-500 to-blue-500",
	},
	{
		id: "local_life",
		label: "현지생활",
		icon: Heart,
		color: "from-teal-500 to-cyan-500",
	},
];

// 언어 옵션들
const LANGUAGES = [
	{ code: "ko", label: "한국어", flag: "🇰🇷" },
	{ code: "en", label: "English", flag: "🇺🇸" },
	{ code: "ja", label: "日本語", flag: "🇯🇵" },
	{ code: "zh", label: "中文", flag: "🇨🇳" },
	{ code: "es", label: "Español", flag: "🇪🇸" },
	{ code: "fr", label: "Français", flag: "🇫🇷" },
];

export default function SignupGlow({
	actionData,
}: {
	actionData?: ActionData;
}) {
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
		const result = (() => {
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
		})();

		// 디버깅용 로그
		console.log(`🔍 Step ${step} 유효성 검사:`, {
			step,
			result,
			formData: step === 5 ? { languages: formData.languages } : null,
		});

		return result;
	};

	const stepTitles = [
		"어떤 유형의 사용자인지 선택해주세요",
		"기본 정보를 입력해주세요",
		"위치 정보를 설정해주세요",
		"관심사를 선택해주세요",
		"사용 가능한 언어를 선택해주세요",
	];

	const navigation = useNavigation();

	// 소셜 로그인 처리
	const handleSocialLogin = async (provider: "google" | "kakao") => {
		try {
			console.log(`🔗 ${provider} 소셜 로그인 시작`);

			// 서버 액션을 통해 소셜 로그인 처리
			const form = new FormData();
			form.append("provider", provider);
			form.append("action", "social_login");

			// 현재 폼 데이터도 함께 전송 (나중에 프로필 완성용)
			form.append("userType", formData.userType);
			form.append("interests", JSON.stringify(formData.interests));
			form.append("languages", JSON.stringify(formData.languages));
			form.append("location", formData.location);
			form.append(
				"marketingConsent",
				formData.marketingConsent.toString()
			);

			const response = await fetch(window.location.pathname, {
				method: "POST",
				body: form,
			});

			const result = await response.json();

			if (result.redirectUrl) {
				window.location.href = result.redirectUrl;
			} else if (result.error) {
				console.error(`❌ ${provider} 로그인 오류:`, result.error);
			}
		} catch (error) {
			console.error(`❌ ${provider} 로그인 처리 중 오류:`, error);
		}
	};

	return (
		<div className="min-h-screen bg-black text-white overflow-hidden">
			{/* 배경 그라데이션 애니메이션 */}
			<div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 animate-pulse" />
			<div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />

			{/* 플로팅 요소들 */}
			<div className="absolute top-20 left-10 w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-1000" />
			<div className="absolute top-40 right-20 w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-2000" />
			<div className="absolute bottom-40 left-20 w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-500" />

			<div className="relative min-h-screen flex items-start justify-center pt-8 md:pt-12 pb-6 px-4">
				<div className="mx-auto max-w-md w-full">
					{/* 헤더 */}
					<div className="text-center mb-8">
						<Link
							to="/landing_glow"
							className="inline-flex items-center font-bold tracking-tighter text-2xl mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
						>
							<Sparkles className="w-6 h-6 mr-2 text-purple-400" />
							Here&Now
						</Link>

						<h1 className="text-3xl md:text-4xl font-bold mb-4">
							<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
								새로운 만남이
							</span>
							<br />
							<span className="text-white">시작됩니다</span>
						</h1>
					</div>

					{/* 진행률 표시 */}
					<div className="mb-8">
						<div className="flex justify-between items-center mb-3">
							<span className="text-sm text-purple-300">
								단계 {step} / 5
							</span>
							<span className="text-sm text-purple-300">
								{Math.round((step / 5) * 100)}% 완료
							</span>
						</div>
						<div className="h-2 bg-purple-900/30 rounded-full backdrop-blur-sm">
							<div
								className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/25"
								style={{ width: `${(step / 5) * 100}%` }}
							/>
						</div>
					</div>

					{/* 메인 카드 */}
					<div className="relative">
						<Card className="bg-black/40 backdrop-blur-md border border-purple-500/20 shadow-2xl shadow-purple-500/10">
							<CardHeader className="text-center">
								{step === 1 && (
									<CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
										Here&Now에 오신 것을 환영합니다!
									</CardTitle>
								)}
								<CardDescription className="text-gray-300 text-lg">
									{stepTitles[step - 1]}
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-6">
								{/* 1단계: 사용자 유형 선택 */}
								{step === 1 && (
									<div className="space-y-4">
										<RadioGroup
											value={formData.userType}
											onValueChange={(value: string) =>
												updateFormData({
													userType: value,
												})
											}
											className="space-y-4"
										>
											<div className="relative group">
												<div className="flex items-center space-x-3 p-6 border border-purple-500/30 rounded-xl hover:bg-purple-500/10 cursor-pointer transition-all duration-300 group-hover:border-purple-400/50 bg-gradient-to-r from-purple-900/10 to-pink-900/10 backdrop-blur-sm">
													<RadioGroupItem
														value="traveler"
														id="traveler"
														className="border-purple-400 text-purple-400"
													/>
													<Label
														htmlFor="traveler"
														className="flex-1 cursor-pointer"
													>
														<div className="flex items-center">
															<Globe className="w-6 h-6 mr-3 text-purple-400" />
															<div>
																<div className="font-semibold text-white text-lg">
																	여행자
																</div>
																<div className="text-sm text-gray-300">
																	새로운
																	도시에서
																	현지인과
																	만나고
																	싶어요
																</div>
															</div>
														</div>
													</Label>
												</div>
												{formData.userType ===
													"traveler" && (
													<BorderBeam />
												)}
											</div>

											<div className="relative group">
												<div className="flex items-center space-x-3 p-6 border border-purple-500/30 rounded-xl hover:bg-purple-500/10 cursor-pointer transition-all duration-300 group-hover:border-purple-400/50 bg-gradient-to-r from-blue-900/10 to-cyan-900/10 backdrop-blur-sm">
													<RadioGroupItem
														value="local_host"
														id="local_host"
														className="border-purple-400 text-purple-400"
													/>
													<Label
														htmlFor="local_host"
														className="flex-1 cursor-pointer"
													>
														<div className="flex items-center">
															<Heart className="w-6 h-6 mr-3 text-pink-400" />
															<div>
																<div className="font-semibold text-white text-lg">
																	현지 호스트
																</div>
																<div className="text-sm text-gray-300">
																	여행자들과
																	만나서 우리
																	동네를
																	소개하고
																	싶어요
																</div>
															</div>
														</div>
													</Label>
												</div>
												{formData.userType ===
													"local_host" && (
													<BorderBeam />
												)}
											</div>
										</RadioGroup>
									</div>
								)}

								{/* 2단계: 기본 정보 입력 */}
								{step === 2 && (
									<div className="space-y-6">
										<div className="space-y-2">
											<Label
												htmlFor="email"
												className="text-purple-300 font-medium"
											>
												이메일
											</Label>
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
												className="bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
												required
											/>
										</div>

										<div className="space-y-2">
											<Label
												htmlFor="name"
												className="text-purple-300 font-medium"
											>
												이름
											</Label>
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
												className="bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
												required
											/>
										</div>

										<div className="space-y-2">
											<Label
												htmlFor="password"
												className="text-purple-300 font-medium"
											>
												비밀번호
											</Label>
											<Input
												id="password"
												name="password"
												type="password"
												value={formData.password}
												onChange={(
													e: React.ChangeEvent<HTMLInputElement>
												) =>
													updateFormData({
														password:
															e.target.value,
													})
												}
												placeholder="8자 이상 입력해주세요"
												className="bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
												required
											/>
										</div>

										<div className="space-y-2">
											<Label
												htmlFor="confirmPassword"
												className="text-purple-300 font-medium"
											>
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
														confirmPassword:
															e.target.value,
													})
												}
												placeholder="비밀번호를 다시 입력해주세요"
												className="bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
												required
											/>
											{formData.password &&
												formData.confirmPassword &&
												formData.password !==
													formData.confirmPassword && (
													<p className="text-sm text-red-400 flex items-center">
														<Zap className="w-4 h-4 mr-1" />
														비밀번호가 일치하지
														않습니다
													</p>
												)}
										</div>
										{/* 
										<div className="space-y-2">
											<Label
												htmlFor="bio"
												className="text-purple-300 font-medium"
											>
												자기소개 (선택)
											</Label>
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
												className="bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm resize-none"
											/>
										</div> */}
									</div>
								)}

								{/* 3단계: 위치 설정 */}
								{step === 3 && (
									<div className="space-y-6">
										<div className="space-y-2">
											<Label
												htmlFor="location"
												className="text-purple-300 font-medium flex items-center"
											>
												<MapPin className="w-4 h-4 mr-2" />
												현재 위치
											</Label>
											<Input
												id="location"
												value={formData.location}
												onChange={(
													e: React.ChangeEvent<HTMLInputElement>
												) =>
													updateFormData({
														location:
															e.target.value,
													})
												}
												placeholder="예: 서울, 강남구"
												className="bg-black/20 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 backdrop-blur-sm"
												required
											/>
											<p className="text-sm text-gray-300">
												{formData.userType ===
												"traveler"
													? "여행 중인 도시나 지역을 입력해주세요"
													: "거주하고 있는 도시나 지역을 입력해주세요"}
											</p>
										</div>

										<div className="flex items-center space-x-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
											<Checkbox
												id="marketing"
												checked={
													formData.marketingConsent
												}
												onCheckedChange={(
													checked: boolean
												) =>
													updateFormData({
														marketingConsent:
															checked,
													})
												}
												className="border-purple-400 data-[state=checked]:bg-purple-500"
											/>
											<Label
												htmlFor="marketing"
												className="text-sm text-gray-300"
											>
												마케팅 정보 수신에 동의합니다
												(선택)
											</Label>
										</div>
									</div>
								)}

								{/* 4단계: 관심사 선택 */}
								{step === 4 && (
									<div className="space-y-6">
										<div>
											<Label className="text-lg font-semibold text-purple-300 flex items-center mb-4">
												<Star className="w-5 h-5 mr-2" />
												관심사 선택
											</Label>
											<p className="text-sm text-gray-300 mb-4">
												함께 즐기고 싶은 활동들을
												선택해주세요
											</p>
											<div className="grid grid-cols-2 gap-3">
												{INTERESTS.map(
													({
														id,
														label,
														icon: Icon,
														color,
													}) => (
														<div
															key={id}
															className="relative"
														>
															<Button
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
																	toggleInterest(
																		id
																	)
																}
																className={`w-full justify-start h-auto p-4 transition-all duration-300 ${
																	formData.interests.includes(
																		id
																	)
																		? `bg-gradient-to-r ${color} text-white border-transparent shadow-lg`
																		: "bg-black/20 border-purple-500/30 text-gray-300 hover:bg-purple-500/10 hover:border-purple-400/50 backdrop-blur-sm"
																}`}
															>
																<Icon className="w-4 h-4 mr-2" />
																{label}
															</Button>
															{formData.interests.includes(
																id
															) && (
																<div
																	className={`absolute inset-0 rounded-md bg-gradient-to-r ${color} opacity-20 blur-md -z-10`}
																/>
															)}
														</div>
													)
												)}
											</div>
										</div>
									</div>
								)}

								{/* 5단계: 언어 선택 */}
								{step === 5 && (
									<div className="space-y-6">
										<div>
											<Label className="text-lg font-semibold text-purple-300 flex items-center mb-4">
												<Globe className="w-5 h-5 mr-2" />
												사용 가능한 언어
											</Label>
											<p className="text-sm text-gray-300 mb-4">
												대화할 수 있는 언어를
												선택해주세요
											</p>
											<div className="grid grid-cols-2 gap-3">
												{LANGUAGES.map(
													({ code, label, flag }) => (
														<div
															key={code}
															className="relative"
														>
															<Button
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
																	toggleLanguage(
																		code
																	)
																}
																className={`w-full justify-center h-auto p-4 transition-all duration-300 ${
																	formData.languages.includes(
																		code
																	)
																		? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-lg"
																		: "bg-black/20 border-purple-500/30 text-gray-300 hover:bg-purple-500/10 hover:border-purple-400/50 backdrop-blur-sm"
																}`}
															>
																<span className="mr-2 text-lg">
																	{flag}
																</span>
																{label}
															</Button>
															{formData.languages.includes(
																code
															) && (
																<div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 blur-md -z-10" />
															)}
														</div>
													)
												)}
											</div>
										</div>

										{/* 최종 정보 요약 */}
										<div className="mt-6 p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20 backdrop-blur-sm">
											<h4 className="font-semibold mb-4 text-purple-300 flex items-center">
												<Sparkles className="w-5 h-5 mr-2" />
												입력하신 정보
											</h4>
											<div className="space-y-2 text-sm">
												<p className="text-gray-300">
													<strong className="text-white">
														유형:
													</strong>{" "}
													{formData.userType ===
													"traveler"
														? "여행자"
														: "현지 호스트"}
												</p>
												<p className="text-gray-300">
													<strong className="text-white">
														이름:
													</strong>{" "}
													{formData.name}
												</p>
												<p className="text-gray-300">
													<strong className="text-white">
														이메일:
													</strong>{" "}
													{formData.email}
												</p>
												<p className="text-gray-300">
													<strong className="text-white">
														위치:
													</strong>{" "}
													{formData.location}
												</p>
												<p className="text-gray-300">
													<strong className="text-white">
														관심사:
													</strong>{" "}
													{formData.interests
														.map(
															(id) =>
																INTERESTS.find(
																	(i) =>
																		i.id ===
																		id
																)?.label
														)
														.join(", ")}
												</p>
												<p className="text-gray-300">
													<strong className="text-white">
														언어:
													</strong>{" "}
													{formData.languages
														.map(
															(code) =>
																LANGUAGES.find(
																	(l) =>
																		l.code ===
																		code
																)?.label
														)
														.join(", ")}
												</p>
											</div>
										</div>
									</div>
								)}

								{/* 에러 메시지 */}
								{actionData?.errors?.general && (
									<div className="text-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
										<p className="text-red-400 text-sm">
											{actionData.errors.general}
										</p>
									</div>
								)}

								{/* 네비게이션 버튼 */}
								<div className="flex justify-between pt-6">
									{step > 1 ? (
										<Button
											type="button"
											variant="outline"
											onClick={prevStep}
											className="border-purple-500/50 text-purple-100 hover:text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/70 backdrop-blur-sm bg-purple-700/20"
										>
											<ChevronLeft className="w-4 h-4 mr-2" />
											이전
										</Button>
									) : (
										<div />
									)}

									{step < 5 ? (
										<div className="relative">
											<Button
												type="button"
												onClick={nextStep}
												disabled={!isStepValid()}
												className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												다음
												<ChevronRight className="w-4 h-4 ml-2" />
											</Button>
											{isStepValid() && <BorderBeam />}
										</div>
									) : (
										<Form
											method="post"
											onSubmit={(e) => {
												console.log(
													"📤 Form 제출 시작!"
												);
												console.log(
													"📋 현재 formData:",
													formData
												);
												console.log(
													"✅ 5단계 유효성 검사:",
													isStepValid()
												);
											}}
										>
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

											<div className="relative">
												<Button
													type="submit"
													disabled={
														!isStepValid() ||
														navigation.state ===
															"submitting"
													}
													className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-3 font-semibold shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
												>
													{navigation.state ===
													"submitting" ? (
														<>
															<Loader2 className="w-5 h-5 mr-2 animate-spin" />
															가입 처리 중...
														</>
													) : (
														<>
															<Heart className="w-5 h-5 mr-2" />
															가입 완료
														</>
													)}
												</Button>
												{isStepValid() &&
													navigation.state !==
														"submitting" && (
														<BorderBeam />
													)}
											</div>
										</Form>
									)}
								</div>
							</CardContent>
						</Card>
						<BorderBeam />
					</div>

					{/* 소셜 로그인 섹션 */}
					<div className="mt-8">
						{/* 구분선 */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-purple-500/30"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-4 bg-black text-gray-400">
									또는
								</span>
							</div>
						</div>

						{/* 소셜 로그인 버튼들 */}
						<div className="mt-6 space-y-3">
							<Button
								type="button"
								variant="outline"
								className="w-full border-purple-500/30 text-white hover:bg-purple-500/10 hover:border-purple-400/50 backdrop-blur-sm bg-black/20 py-3"
								onClick={() => handleSocialLogin("google")}
							>
								<GoogleLogo className="w-5 h-5 mr-3" />
								Google로 계속하기
							</Button>

							<Button
								type="button"
								variant="outline"
								className="w-full border-purple-500/30 text-white hover:bg-purple-500/10 hover:border-purple-400/50 backdrop-blur-sm bg-black/20 py-3"
								onClick={() => handleSocialLogin("kakao")}
							>
								<KakaoLogo className="w-5 h-5 mr-3 size-4 scale-125 text-yellow-300" />
								Kakao로 계속하기
							</Button>
						</div>
					</div>

					{/* 로그인 링크 */}
					<div className="text-center mt-8">
						<p className="text-gray-300">
							이미 계정이 있으신가요?{" "}
							<Link
								to="/login"
								className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
							>
								로그인하기
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
