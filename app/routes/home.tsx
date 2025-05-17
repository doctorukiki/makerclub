import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<Button asChild>
				<Link to="https://miumiupoly.pages.dev/">내 블로그로 이동</Link>
			</Button>
		</div>
	);
}
