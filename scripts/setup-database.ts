import postgres from "postgres";
import { readFileSync } from "fs";
import { join } from "path";

async function setupDatabase() {
	console.log("🚀 데이터베이스 설정 시작...");

	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL 환경 변수가 설정되지 않았습니다.");
	}

	const sql = postgres(process.env.DATABASE_URL, { max: 1 });

	try {
		// SQL 파일 읽기
		const sqlContent = readFileSync(
			join(process.cwd(), "scripts/create-tables.sql"),
			"utf-8"
		);

		console.log("📝 SQL 스크립트 실행 중...");

		// SQL 실행
		await sql.unsafe(sqlContent);

		console.log("✅ 데이터베이스 설정 완료!");
	} catch (error) {
		console.error("❌ 데이터베이스 설정 실패:", error);
		throw error;
	} finally {
		await sql.end();
	}
}

setupDatabase().catch((error) => {
	console.error("데이터베이스 설정 중 오류:", error);
	process.exit(1);
});
