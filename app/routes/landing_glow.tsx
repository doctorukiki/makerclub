import { useState, useEffect } from "react";
import { BorderBeam } from "components/magicui/border-beam";
import { ShineBorder } from "components/magicui/shine-border";
import { Link, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
	Heart,
	Users,
	MapPin,
	Camera,
	Coffee,
	Plane,
	Star,
	MessageCircle,
	Globe,
	Sparkles,
	Zap,
	ArrowRight,
} from "lucide-react";
import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
} from "react-router";

export function loader({ request }: LoaderFunctionArgs) {
	return {};
}

export const meta: MetaFunction = () => [
	{ title: "Here&Now - 여행에서 만나는 새로운 친구들" },
	{
		name: "description",
		content: "전 세계 어디서든 현지인과 여행자가 만나는 소셜 플랫폼",
	},
];

export default function LandingGlow() {
	const [searchParams] = useSearchParams();
	const isAbTest = searchParams.get("ab_test");
	const variant = searchParams.get("variant");

	const [activeFeature, setActiveFeature] = useState(0);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
		const interval = setInterval(() => {
			setActiveFeature((prev) => (prev + 1) % 3);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const features = [
		{
			icon: Users,
			title: "순간의 만남",
			description: "지금 여기서, 바로 지금 만날 수 있는 사람들",
			color: "from-purple-500 to-pink-500",
		},
		{
			icon: Heart,
			title: "진짜 연결",
			description: "관심사와 취향으로 연결되는 진정한 인연",
			color: "from-blue-500 to-cyan-500",
		},
		{
			icon: Sparkles,
			title: "마법 같은 순간",
			description: "예상치 못한 특별한 경험과 추억",
			color: "from-orange-500 to-red-500",
		},
	];

	const socialProof = [
		{ icon: Users, count: "10K+", label: "활성 유저" },
		{ icon: Heart, count: "50K+", label: "성공한 만남" },
		{ icon: Globe, count: "100+", label: "도시" },
		{ icon: Star, count: "4.9", label: "평점" },
	];

	return (
		<div className="min-h-screen bg-black text-white overflow-hidden">
			{/* A/B 테스트 디버그 정보 */}
			{isAbTest && process.env.NODE_ENV === "development" && (
				<div className="fixed top-20 right-4 z-50">
					<Badge
						variant="secondary"
						className="bg-purple-900/80 text-purple-200 border-purple-500/30"
					>
						A/B Test: {isAbTest} | Variant: {variant}
					</Badge>
				</div>
			)}

			{/* 배경 그라데이션 애니메이션 */}
			<div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 animate-pulse" />
			<div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />

			{/* 히어로 섹션 */}
			<section className="relative min-h-screen flex items-center justify-center pt-32 px-6">
				<div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10" />

				{/* 플로팅 요소들 */}
				<div className="absolute top-20 left-10 w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-1000" />
				<div className="absolute top-40 right-20 w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-2000" />
				<div className="absolute bottom-40 left-20 w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-500" />

				<div
					className={`max-w-4xl mx-auto text-center space-y-8 transition-all duration-1000 ${
						isVisible
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-10"
					}`}
				>
					{/* 배지 */}
					<div className="flex justify-center mb-6">
						<Badge
							variant="outline"
							className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-200 px-6 py-2 text-sm"
						>
							<Sparkles className="w-4 h-4 mr-2" />전 세계 10,000+
							유저들이 함께하는 공간
						</Badge>
					</div>

					{/* 메인 타이틀 */}
					<h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
						지금 여기서
						<br />
						<span className="text-white">만나자</span>
					</h1>

					{/* 서브 타이틀 */}
					<p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
						여행 중에도, 일상에서도
						<br />
						<span className="text-purple-400 font-semibold">
							바로 지금 만날 수 있는
						</span>{" "}
						사람들과 연결되세요
					</p>

					{/* CTA 버튼들 */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
						<div className="relative group">
							<Button
								size="lg"
								className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl shadow-purple-500/25 transition-all duration-300 group-hover:shadow-purple-500/40"
								asChild
							>
								<Link
									to="/signup"
									className="flex items-center"
								>
									<Zap className="w-5 h-5 mr-2" />
									지금 시작하기
									<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
								</Link>
							</Button>
							<BorderBeam />
						</div>

						<Button
							size="lg"
							variant="outline"
							className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg backdrop-blur-sm"
							asChild
						>
							<Link to="/host/guide">호스트 되기</Link>
						</Button>
					</div>

					{/* 소셜 프루프 */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-2xl mx-auto">
						{socialProof.map((item, index) => (
							<div key={index} className="text-center space-y-2">
								<div className="flex justify-center">
									<item.icon className="w-6 h-6 text-purple-400" />
								</div>
								<div className="text-2xl font-bold text-white">
									{item.count}
								</div>
								<div className="text-sm text-gray-400">
									{item.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 기능 소개 섹션 */}
			<section className="py-24 px-6 relative">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">
							<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
								어떻게 연결될까요?
							</span>
						</h2>
						<p className="text-xl text-gray-300 max-w-2xl mx-auto">
							AI가 당신의 취향과 위치를 분석해 완벽한 매치를
							찾아드려요
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className={`relative p-8 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-pink-900/10 backdrop-blur-sm transition-all duration-500 hover:scale-105 cursor-pointer ${
									activeFeature === index
										? "ring-2 ring-purple-500/50 shadow-2xl shadow-purple-500/20"
										: ""
								}`}
								onMouseEnter={() => setActiveFeature(index)}
							>
								{/* 아이콘 */}
								<div
									className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} p-4 mb-6 mx-auto`}
								>
									<feature.icon className="w-8 h-8 text-white" />
								</div>

								{/* 제목 */}
								<h3 className="text-2xl font-bold text-white mb-4 text-center">
									{feature.title}
								</h3>

								{/* 설명 */}
								<p className="text-gray-300 text-center leading-relaxed">
									{feature.description}
								</p>

								{/* 글로우 효과 */}
								{activeFeature === index && (
									<div
										className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-10 blur-xl -z-10`}
									/>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 라이브 액티비티 섹션 */}
			<section className="py-24 px-6 relative">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
							지금 이 순간
						</span>
					</h2>
					<p className="text-xl text-gray-300 mb-12">
						실시간으로 일어나고 있는 만남들
					</p>

					{/* 라이브 활동 카드들 */}
					<div className="grid md:grid-cols-2 gap-6">
						<div className="relative p-6 rounded-xl border border-green-500/30 bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm">
							<div className="flex items-center mb-4">
								<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3" />
								<span className="text-green-400 font-semibold">
									LIVE
								</span>
							</div>
							<div className="text-left">
								<p className="text-white mb-2">
									<Coffee className="w-4 h-4 inline mr-2" />
									홍대에서 커피 마실 사람 구해요!
								</p>
								<p className="text-gray-400 text-sm">
									서울 • 방금 전
								</p>
							</div>
						</div>

						<div className="relative p-6 rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
							<div className="flex items-center mb-4">
								<div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse mr-3" />
								<span className="text-purple-400 font-semibold">
									LIVE
								</span>
							</div>
							<div className="text-left">
								<p className="text-white mb-2">
									<Camera className="w-4 h-4 inline mr-2" />
									후지산 사진 찍으러 가실 분!
								</p>
								<p className="text-gray-400 text-sm">
									도쿄 • 1분 전
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 최종 CTA */}
			<section className="py-24 px-6 relative">
				<div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10" />
				<div className="max-w-4xl mx-auto text-center relative">
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
							당신의 다음 인연이
						</span>
						<br />
						<span className="text-white">바로 여기 있어요</span>
					</h2>
					<p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
						지금 가입하고 7일 무료로 프리미엄 기능을 체험해보세요
					</p>

					<div className="relative inline-block">
						<Button
							size="lg"
							className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold shadow-2xl shadow-purple-500/25 transition-all duration-300"
							asChild
						>
							<Link to="/signup" className="flex items-center">
								<Heart className="w-6 h-6 mr-3" />
								무료로 시작하기
								<ArrowRight className="w-6 h-6 ml-3" />
							</Link>
						</Button>
						<BorderBeam />
					</div>

					<p className="text-gray-400 text-sm mt-6">
						신용카드 필요 없음 • 언제든 취소 가능
					</p>
				</div>
			</section>

			{/* 푸터 */}
			<footer className="border-t border-purple-500/20 bg-black/50 backdrop-blur-sm px-6 py-12">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						<div>
							<h3 className="text-lg font-semibold text-purple-400 mb-4">
								Here&Now
							</h3>
							<ul className="space-y-2">
								<li>
									<Link
										to="/about"
										className="text-gray-400 hover:text-purple-400 transition-colors"
									>
										소개
									</Link>
								</li>
								<li>
									<Link
										to="/careers"
										className="text-gray-400 hover:text-purple-400 transition-colors"
									>
										채용
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-purple-400 mb-4">
								커뮤니티
							</h3>
							<ul className="space-y-2">
								<li>
									<Link
										to="/stories"
										className="text-gray-400 hover:text-purple-400 transition-colors"
									>
										스토리
									</Link>
								</li>
								<li>
									<Link
										to="/hosts"
										className="text-gray-400 hover:text-purple-400 transition-colors"
									>
										호스트
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-purple-400 mb-4">
								법적 고지
							</h3>
							<ul className="space-y-2">
								<li>
									<Link
										to="/privacy"
										className="text-gray-400 hover:text-purple-400 transition-colors"
									>
										개인정보처리방침
									</Link>
								</li>
								<li>
									<Link
										to="/terms"
										className="text-gray-400 hover:text-purple-400 transition-colors"
									>
										이용약관
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-purple-400 mb-4">
								도움말
							</h3>
							<ul className="space-y-2">
								<li>
									<Link
										to="/help"
										className="text-gray-400 hover:text-purple-400 transition-colors"
									>
										고객센터
									</Link>
								</li>
								<li>
									<Link
										to="/faq"
										className="text-gray-400 hover:text-purple-400 transition-colors"
									>
										자주 묻는 질문
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="mt-12 pt-8 border-t border-purple-500/20 text-center text-gray-400">
						<p>
							© {new Date().getFullYear()} Here&Now. All rights
							reserved.
						</p>
						<p className="mt-2 text-sm">
							지금 여기서 만나는 특별한 순간들
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
