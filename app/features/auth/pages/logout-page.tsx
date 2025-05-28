import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	console.log("🔄 로그아웃 처리 시작");

	try {
		const { supabase } = await import("~/lib/supabase.server");

		// Supabase 로그아웃
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error("❌ 로그아웃 오류:", error);
		} else {
			console.log("✅ 로그아웃 성공");
		}

		// 로그아웃 후 랜딩 페이지로 리다이렉트
		return redirect("/landing_glow");
	} catch (error) {
		console.error("❌ 로그아웃 처리 중 오류:", error);
		return redirect("/landing_glow");
	}
};

// 이 라우트는 로더만 사용하므로 컴포넌트는 필요 없음
export default function LogoutPage() {
	return <div>로그아웃 중...</div>;
}
