import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/_index.tsx"),
	route("/landing", "routes/landing.tsx"),
	route("/landing_glow", "routes/landing_glow.tsx"),
	route("/login", "routes/login.tsx"),
	route("/signup", "routes/signup.tsx"),
	route("/signup_glow", "routes/signup_glow.tsx"),
	route("/question", "routes/question.tsx"),
] satisfies RouteConfig;
