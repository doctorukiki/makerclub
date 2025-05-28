import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { config } from "dotenv";

// 환경 변수 로드
config();

if (!process.env.SUPABASE_URL) {
	throw new Error("SUPABASE_URL 환경 변수가 설정되지 않았습니다.");
}

if (!process.env.SUPABASE_ANON_KEY) {
	throw new Error("SUPABASE_ANON_KEY 환경 변수가 설정되지 않았습니다.");
}

export const supabase = createClient<Database>(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY
);

/**
 * 요청에서 세션 정보를 가져오는 함수
 */
export async function getSession(request?: Request) {
	try {
		if (request) {
			// 요청 헤더에서 쿠키 가져오기
			const cookies = request.headers.get("cookie");
			if (cookies) {
				// 쿠키에서 세션 토큰 파싱
				const sessionCookie = cookies
					.split(";")
					.find((c) => c.trim().startsWith("sb-access-token="));

				if (sessionCookie) {
					const token = sessionCookie.split("=")[1];
					const {
						data: { user },
						error,
					} = await supabase.auth.getUser(token);

					if (!error && user) {
						return { user };
					}
				}
			}
		}

		// 기본 세션 가져오기
		const {
			data: { session },
		} = await supabase.auth.getSession();
		return session;
	} catch (error) {
		console.error("세션 가져오기 오류:", error);
		return null;
	}
}

export async function getUserProfile(userId: string) {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("profile_id", userId)
		.single();

	if (error) {
		console.error("Error fetching user profile:", error);
		return null;
	}

	return data;
}

/**
 * 세션 쿠키 설정을 위한 헬퍼 함수
 */
export function createSessionCookie(session: any) {
	if (!session?.access_token) return "";

	return `sb-access-token=${session.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`;
}
