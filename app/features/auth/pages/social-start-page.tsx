import { z } from "zod";
import type { Route } from "./+types/social-start-page";
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

	// 현재 도메인을 기반으로 리다이렉트 URL 생성
	const url = new URL(request.url);
	const redirectTo = `${url.origin}/auth/social/${provider}/complete`;

	console.log(`🔗 ${provider} OAuth 시작:`, { redirectTo });

	try {
		const { supabase } = await import("~/lib/supabase.server");

		const {
			data: { url: oauthUrl },
			error,
		} = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo,
				queryParams: {
					access_type: "offline",
					prompt: "consent",
				},
			},
		});

		if (oauthUrl) {
			console.log(`✅ ${provider} OAuth URL 생성 성공`);
			return redirect(oauthUrl);
		}

		if (error) {
			console.error(`❌ ${provider} OAuth URL 생성 오류:`, error);
			return redirect("/signup_glow?error=oauth_url_failed");
		}

		return redirect("/signup_glow?error=unknown");
	} catch (error) {
		console.error(`❌ ${provider} OAuth 처리 중 오류:`, error);
		return redirect("/signup_glow?error=oauth_error");
	}
};
