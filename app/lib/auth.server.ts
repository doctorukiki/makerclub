import { supabase } from "./supabase.server";
import db from "~/core/db/drizzle-client.server";
import { profiles } from "~/core/db/schema";

export interface SignupData {
	email: string;
	password: string;
	name: string;
	userType: "traveler" | "local_host";
	interests: string[];
	languages: string[];
	location: string;
	marketingConsent: boolean;
}

/**
 * 회원가입 처리 함수
 * 1. Supabase Auth로 사용자 생성
 * 2. Drizzle ORM으로 프로필 정보 저장
 */
export async function signUp(signupData: SignupData) {
	try {
		console.log("🔍 환경 변수 체크:", {
			hasSupabaseUrl: !!process.env.SUPABASE_URL,
			hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
			hasDatabaseUrl: !!process.env.DATABASE_URL,
		});

		// 1. Supabase Auth로 사용자 생성 (자동 로그인 포함)
		const { data: authData, error: authError } = await supabase.auth.signUp(
			{
				email: signupData.email,
				password: signupData.password,
				options: {
					// 이메일 확인 없이 바로 로그인 처리
					emailRedirectTo: undefined,
				},
			}
		);

		if (authError) {
			console.error("Auth 회원가입 오류:", authError);
			throw new Error(authError.message);
		}

		if (!authData.user) {
			throw new Error("사용자 생성에 실패했습니다.");
		}

		// 2. 자동 로그인 처리 (이메일 확인이 필요한 경우를 위해)
		if (!authData.session) {
			console.log("🔄 자동 로그인 시도 중...");
			const { data: signInData, error: signInError } =
				await supabase.auth.signInWithPassword({
					email: signupData.email,
					password: signupData.password,
				});

			if (signInError) {
				console.warn("자동 로그인 실패:", signInError.message);
				// 로그인 실패해도 회원가입은 성공이므로 계속 진행
			} else {
				console.log("✅ 자동 로그인 성공");
			}
		}

		// 3. Drizzle ORM으로 프로필 정보 저장
		const profileData = {
			profile_id: authData.user.id,
			name: signupData.name,
			role: signupData.userType as "traveler" | "local_host",
			language: signupData.languages,
			interests: signupData.interests,
			location: signupData.location,
			is_host: signupData.userType === "local_host",
			marketing_consent: signupData.marketingConsent,
		};

		const [profile] = await db
			.insert(profiles)
			.values(profileData)
			.returning();

		console.log("✅ 회원가입 성공:", {
			userId: authData.user.id,
			email: authData.user.email,
			profile: profile,
		});

		return {
			success: true,
			user: authData.user,
			profile: profile,
			session: authData.session,
		};
	} catch (error) {
		console.error("❌ 회원가입 처리 오류:", error);

		// 에러 메시지를 사용자 친화적으로 변환
		let errorMessage = "회원가입 중 오류가 발생했습니다.";

		if (error instanceof Error) {
			if (error.message.includes("already registered")) {
				errorMessage = "이미 가입된 이메일입니다.";
			} else if (error.message.includes("password")) {
				errorMessage = "비밀번호가 요구사항을 만족하지 않습니다.";
			} else if (error.message.includes("email")) {
				errorMessage = "유효하지 않은 이메일 형식입니다.";
			} else if (error.message.includes("환경 변수")) {
				errorMessage = "서버 설정 오류입니다. 관리자에게 문의해주세요.";
			}
		}

		return {
			success: false,
			error: errorMessage,
		};
	}
}

/**
 * 로그인 처리 함수
 */
export async function signIn(email: string, password: string) {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("로그인 오류:", error);
			throw new Error(error.message);
		}

		return {
			success: true,
			user: data.user,
			session: data.session,
		};
	} catch (error) {
		console.error("❌ 로그인 처리 오류:", error);

		let errorMessage = "로그인 중 오류가 발생했습니다.";

		if (error instanceof Error) {
			if (error.message.includes("Invalid login credentials")) {
				errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
			}
		}

		return {
			success: false,
			error: errorMessage,
		};
	}
}

/**
 * 로그아웃 처리 함수
 */
export async function signOut() {
	try {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error("로그아웃 오류:", error);
			throw new Error(error.message);
		}

		return { success: true };
	} catch (error) {
		console.error("❌ 로그아웃 처리 오류:", error);
		return {
			success: false,
			error: "로그아웃 중 오류가 발생했습니다.",
		};
	}
}
