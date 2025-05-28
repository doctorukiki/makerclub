import { z } from "zod";
import type { Route } from "./+types/social-complete-page";
import { redirect } from "react-router";

const paramsSchema = z.object({
	provider: z.enum(["google", "kakao"]),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	const { success, data } = paramsSchema.safeParse(params);
	if (!success) {
		console.error("❌ 잘못된 provider:", params);
		return redirect("/signup_glow?error=invalid_provider");
	}

	const { provider } = data;
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const error = url.searchParams.get("error");

	console.log(`🔄 ${provider} OAuth 콜백 처리 시작:`, {
		code: !!code,
		error,
	});

	if (error) {
		console.error(`❌ ${provider} OAuth 오류:`, error);
		return redirect("/signup_glow?error=oauth_error");
	}

	if (!code) {
		console.error(`❌ ${provider} OAuth 코드가 없습니다`);
		return redirect("/signup_glow?error=no_code");
	}

	try {
		const { supabase } = await import("~/lib/supabase.server");

		// OAuth 코드를 세션으로 교환
		const { data: sessionData, error: exchangeError } =
			await supabase.auth.exchangeCodeForSession(code);

		if (exchangeError) {
			console.error(`❌ ${provider} 코드 교환 오류:`, exchangeError);
			return redirect("/signup_glow?error=exchange_failed");
		}

		if (sessionData.session && sessionData.user) {
			console.log(`✅ ${provider} OAuth 로그인 성공:`, {
				userId: sessionData.user.id,
				email: sessionData.user.email,
				provider: sessionData.user.app_metadata.provider,
			});

			// 사용자 프로필이 이미 존재하는지 확인
			const db = (await import("~/core/db/drizzle-client.server"))
				.default;
			const { profiles } = await import("~/core/db/schema");
			const { eq } = await import("drizzle-orm");

			const existingProfile = await db
				.select()
				.from(profiles)
				.where(eq(profiles.profile_id, sessionData.user.id))
				.limit(1);

			if (existingProfile.length > 0) {
				// 기존 사용자 - 홈으로 리다이렉트
				console.log(`✅ ${provider} 기존 사용자 로그인`);
				return redirect("/");
			} else {
				// 새 사용자 - 프로필 생성 필요
				console.log(`🆕 ${provider} 새 사용자 - 프로필 생성 필요`);

				// 기본 프로필 생성
				const profileData = {
					profile_id: sessionData.user.id,
					name:
						sessionData.user.user_metadata.full_name ||
						sessionData.user.user_metadata.name ||
						sessionData.user.email?.split("@")[0] ||
						"사용자",
					bio: null,
					language: ["korean"],
					interests: null,
					location: null,
					is_host: false,
					avatar_url:
						sessionData.user.user_metadata.avatar_url ||
						sessionData.user.user_metadata.picture ||
						null,
					marketing_consent: false,
					role: "traveler" as const,
					status: "active" as const,
				};

				await db.insert(profiles).values(profileData);
				console.log(`✅ ${provider} 기본 프로필 생성 완료`);

				// 성향 평가로 리다이렉트
				return redirect(`/question_glow?userId=${sessionData.user.id}`);
			}
		}

		return redirect("/signup_glow?error=unknown");
	} catch (error) {
		console.error(`❌ ${provider} OAuth 콜백 처리 중 오류:`, error);
		return redirect("/signup_glow?error=callback_error");
	}
};
