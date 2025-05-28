import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

async function runMigration() {
	console.log("🚀 마이그레이션 시작...");

	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL 환경 변수가 설정되지 않았습니다.");
	}

	// 마이그레이션용 연결 (max: 1로 설정)
	const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
	const db = drizzle(migrationClient);

	try {
		await migrate(db, { migrationsFolder: "./drizzle" });
		console.log("✅ 마이그레이션 완료!");
	} catch (error) {
		console.error("❌ 마이그레이션 실패:", error);
		throw error;
	} finally {
		await migrationClient.end();
	}
}

runMigration().catch((error) => {
	console.error("마이그레이션 실행 중 오류:", error);
	process.exit(1);
});
