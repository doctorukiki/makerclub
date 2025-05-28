import {
	type RouteConfig,
	index,
	route,
	prefix,
} from "@react-router/dev/routes";

export default [
	index("routes/_index.tsx"),
	route("/landing", "routes/landing.tsx"),
	route("/landing_glow", "routes/landing_glow.tsx"),
	route("/login", "routes/login.tsx"),
	route("/signup", "routes/signup.tsx"),
	route("/signup_glow", "routes/signup_glow.tsx"),
	route("/question_glow", "routes/question_glow.tsx"),
	route("/question", "routes/question.tsx"),
	...prefix("/auth", [
		...prefix("/social/:provider", [
			route("/start", "features/auth/pages/social-start-page.tsx"),
			route("/complete", "features/auth/pages/social-complete-page.tsx"),
		]),
		route("/logout", "features/auth/pages/logout-page.tsx"),
	]),
] satisfies RouteConfig;
