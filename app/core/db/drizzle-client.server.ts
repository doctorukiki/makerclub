import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";

// 환경 변수 로드
config();

const client = postgres(process.env.DATABASE_URL!, { prepare: false });

const db = drizzle({ client });

export default db;
