import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const error = url.searchParams.get("error");

	console.log("🔄 OAuth 콜백 처리 시작:", { code: !!code, error });

	if (error) {
		console.error("❌ OAuth 오류:", error);
		return redirect("/signup_glow?error=oauth_error");
	}

	if (!code) {
		console.error("❌ OAuth 코드가 없습니다");
		return redirect("/signup_glow?error=no_code");
	}

	try {
		const { supabase } = await import("~/lib/supabase.server");

		// OAuth 코드를 세션으로 교환
		const { data, error: exchangeError } =
			await supabase.auth.exchangeCodeForSession(code);

		if (exchangeError) {
			console.error("❌ 코드 교환 오류:", exchangeError);
			return redirect("/signup_glow?error=exchange_failed");
		}

		if (data.session && data.user) {
			console.log("✅ OAuth 로그인 성공:", {
				userId: data.user.id,
				email: data.user.email,
				provider: data.user.app_metadata.provider,
			});

			// 사용자 프로필이 이미 존재하는지 확인
			const db = (await import("~/core/db/drizzle-client.server"))
				.default;
			const { profiles } = await import("~/core/db/schema");
			const { eq } = await import("drizzle-orm");

			const existingProfile = await db
				.select()
				.from(profiles)
				.where(eq(profiles.profile_id, data.user.id))
				.limit(1);

			if (existingProfile.length > 0) {
				// 기존 사용자 - 홈으로 리다이렉트
				console.log("✅ 기존 사용자 로그인");
				return redirect("/");
			} else {
				// 새 사용자 - 프로필 생성 필요
				console.log("🆕 새 사용자 - 프로필 생성 필요");

				// 기본 프로필 생성
				const profileData = {
					profile_id: data.user.id,
					name:
						data.user.user_metadata.full_name ||
						data.user.email?.split("@")[0] ||
						"사용자",
					bio: null,
					language: ["korean"],
					interests: null,
					location: null,
					is_host: false,
					avatar_url: data.user.user_metadata.avatar_url || null,
					marketing_consent: false,
					role: "traveler" as const,
					status: "active" as const,
				};

				await db.insert(profiles).values(profileData);
				console.log("✅ 기본 프로필 생성 완료");

				// 성향 평가로 리다이렉트
				return redirect(`/question_glow?userId=${data.user.id}`);
			}
		}

		return redirect("/signup_glow?error=unknown");
	} catch (error) {
		console.error("❌ OAuth 콜백 처리 중 오류:", error);
		return redirect("/signup_glow?error=callback_error");
	}
}

// 이 라우트는 로더만 사용하므로 컴포넌트는 필요 없음
export default function AuthCallback() {
	return <div>처리 중...</div>;
}
