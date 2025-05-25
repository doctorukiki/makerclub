import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

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

export async function getSession() {
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return session;
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
