import { redirect } from "react-router";
import type { Route } from "./+types/_index";

// A/B 테스트 설정
const AB_TEST_CONFIG = {
	// 'random' 또는 'round_robin' 선택
	mode: "random" as "random" | "round_robin",
	// 50/50 분할 비율 (random 모드에서만 사용)
	glowPageRatio: 1,
};

export function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url);

	let shouldUseGlow = false;

	if (AB_TEST_CONFIG.mode === "random") {
		// 랜덤 방식: 50/50 또는 설정된 비율로 분할
		shouldUseGlow = Math.random() < AB_TEST_CONFIG.glowPageRatio;
	} else if (AB_TEST_CONFIG.mode === "round_robin") {
		// 라운드로빈 방식: 시간 기반으로 번갈아가며 표시
		// 10초마다 전환 (실제 서비스에서는 더 긴 주기 권장)
		const now = Date.now();
		const cycleLength = 10000; // 10초
		const currentCycle = Math.floor(now / cycleLength);
		shouldUseGlow = currentCycle % 2 === 1;
	}

	// 디버그 정보를 쿼리 파라미터로 추가 (개발 환경에서만)
	if (process.env.NODE_ENV === "development") {
		const targetPath = shouldUseGlow ? "/landing_glow" : "/landing";
		const debugUrl = new URL(targetPath, url.origin);
		debugUrl.searchParams.set("ab_test", AB_TEST_CONFIG.mode);
		debugUrl.searchParams.set(
			"variant",
			shouldUseGlow ? "glow" : "original"
		);
		return redirect(debugUrl.toString());
	}

	return redirect(shouldUseGlow ? "/landing_glow" : "/landing");
}

export const meta: Route.MetaFunction = () => [
	{ title: "Here&Now - 여행에서 만나는 새로운 친구들" },
	{
		name: "description",
		content: "전 세계 어디서든 현지인과 여행자가 만나는 소셜 플랫폼",
	},
];

// 이 컴포넌트는 실제로 렌더링되지 않을 것입니다 (loader에서 리다이렉트)
export default function Index() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<h1 className="text-2xl font-bold mb-4">Here&Now</h1>
				<p className="text-gray-600">
					최적의 경험을 준비하고 있습니다...
				</p>
			</div>
		</div>
	);
}
