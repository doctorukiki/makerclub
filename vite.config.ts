import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	// 환경 변수 로드
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
		optimizeDeps: {
			include: ["react", "react-dom", "react-router"],
		},
		server: {
			hmr: {
				overlay: false,
			},
		},
		define: {
			// 서버 사이드에서 사용할 환경 변수들을 명시적으로 정의
			"process.env.DATABASE_URL": JSON.stringify(env.DATABASE_URL),
			"process.env.SUPABASE_URL": JSON.stringify(env.SUPABASE_URL),
			"process.env.SUPABASE_ANON_KEY": JSON.stringify(
				env.SUPABASE_ANON_KEY
			),
			"process.env.SUPABASE_SERVICE_ROLE_KEY": JSON.stringify(
				env.SUPABASE_SERVICE_ROLE_KEY
			),
		},
	};
});
