import { BorderBeam } from "components/magicui/border-beam";
import { ShineBorder } from "components/magicui/shine-border";
import { Link, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export default function Landing() {
	const [searchParams] = useSearchParams();
	const isAbTest = searchParams.get("ab_test");
	const variant = searchParams.get("variant");

	return (
		<div className="min-h-screen">
			{/* A/B 테스트 디버그 정보 */}
			{isAbTest && process.env.NODE_ENV === "development" && (
				<div className="fixed top-20 right-4 z-50">
					<Badge
						variant="secondary"
						className="bg-blue-100 text-blue-800"
					>
						A/B Test: {isAbTest} | Variant: {variant}
					</Badge>
				</div>
			)}

			{/* 히어로 섹션 */}
			<section className="relative flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 pt-32">
				<div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-2">
					<div className="flex flex-col justify-center">
						<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
							여행지에서 친구를 만나는 가장 자연스럽고 즐거운 방법
						</h1>
						<p className="mt-6 text-lg leading-8 text-gray-600">
							새로운 여행지에서 현지인과 함께하는 특별한 경험을
							만들어보세요. 관심사가 맞는 사람들과 연결되어 더
							풍부한 여행을 즐길 수 있습니다.
						</p>
						<div className="mt-10 flex items-center gap-x-6">
							<Button size="lg" asChild>
								<Link to="/signup">시작하기</Link>
							</Button>
							<div className="relative rounded-md">
								<Button size="lg" variant="outline" asChild>
									<Link to="/host/guide">호스트 되기</Link>
								</Button>

								<ShineBorder
									shineColor={[
										"#A07CFE",
										"#FE8FB5",
										"#FFBE7B",
									]}
								/>
							</div>
						</div>
					</div>
					<div className="flex items-center justify-center">
						<div className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-gray-200">
							<img
								src="/van-with-road.jpg"
								alt="노란색 밴이 붉은 바위 풍경 사이 도로를 달리는 여행 이미지"
								className="absolute inset-0 w-full h-full object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* 기능 소개 섹션 */}
			<section className="py-24">
				<div className="mx-auto max-w-7xl px-6">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
							새로운 여행경험을 만들어보세요
						</h2>
						<p className="mt-6 text-base leading-8 text-gray-600">
							HereNow는 여행자와 현지인을 연결하여 더 풍부하고
							의미 있는 경험을 제공합니다.
						</p>
					</div>
					<div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
						{/* 기능 카드 1 */}
						<div className="flex flex-col items-start">
							<div className="rounded-md bg-blue-500 p-3 text-white">
								{/* 아이콘 자리 */}
							</div>
							<h3 className="mt-6 text-xl font-semibold text-gray-900">
								관심사 기반 매칭
							</h3>
							<p className="mt-2 text-base text-gray-600">
								당신의 관심사와 취향에 맞는 현지인과 자연스럽게
								연결됩니다.
							</p>
						</div>
						{/* 기능 카드 2 */}
						<div className="flex flex-col items-start">
							<div className="rounded-md bg-green-500 p-3 text-white">
								{/* 아이콘 자리 */}
							</div>
							<h3 className="mt-6 text-xl font-semibold text-gray-900">
								현지 체험
							</h3>
							<p className="mt-2 text-base text-gray-600">
								현지인과 함께하는 독특한 체험으로 여행의 깊이를
								더합니다.
							</p>
						</div>
						{/* 기능 카드 3 */}
						<div className="flex flex-col items-start">
							<div className="rounded-md bg-purple-500 p-3 text-white">
								{/* 아이콘 자리 */}
							</div>
							<h3 className="mt-6 text-xl font-semibold text-gray-900">
								안전한 만남
							</h3>
							<p className="mt-2 text-base text-gray-600">
								검증된 호스트와 안전한 시스템을 통해 걱정 없이
								만남을 즐길 수 있습니다.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA 섹션 */}
			<section className="bg-blue-50 py-24">
				<div className="mx-auto max-w-7xl px-6 text-center">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						지금 바로 시작하세요
					</h2>
					<p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
						새로운 사람들과 특별한 경험을 만들어보세요. HereNow와
						함께라면 어디서든 연결될 수 있습니다.
					</p>
					<div className="mt-10 flex items-center justify-center gap-x-6">
						<Button size="lg" asChild>
							<Link to="/signup">무료로 시작하기</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* 푸터 */}
			<footer className="bg-gray-900 px-6 py-12 text-white">
				<div className="mx-auto max-w-7xl">
					<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
						<div>
							<h3 className="text-sm font-semibold uppercase">
								회사
							</h3>
							<ul className="mt-4 space-y-2">
								<li>
									<Link
										to="/about"
										className="text-gray-400 hover:text-white"
									>
										소개
									</Link>
								</li>
								<li>
									<Link
										to="/careers"
										className="text-gray-400 hover:text-white"
									>
										채용
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-sm font-semibold uppercase">
								커뮤니티
							</h3>
							<ul className="mt-4 space-y-2">
								<li>
									<Link
										to="/stories"
										className="text-gray-400 hover:text-white"
									>
										스토리
									</Link>
								</li>
								<li>
									<Link
										to="/hosts"
										className="text-gray-400 hover:text-white"
									>
										호스트
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-sm font-semibold uppercase">
								법적 고지
							</h3>
							<ul className="mt-4 space-y-2">
								<li>
									<Link
										to="/privacy"
										className="text-gray-400 hover:text-white"
									>
										개인정보처리방침
									</Link>
								</li>
								<li>
									<Link
										to="/terms"
										className="text-gray-400 hover:text-white"
									>
										이용약관
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-sm font-semibold uppercase">
								도움말
							</h3>
							<ul className="mt-4 space-y-2">
								<li>
									<Link
										to="/help"
										className="text-gray-400 hover:text-white"
									>
										고객센터
									</Link>
								</li>
								<li>
									<Link
										to="/faq"
										className="text-gray-400 hover:text-white"
									>
										자주 묻는 질문
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
						© {new Date().getFullYear()} HereNow. All rights
						reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}
