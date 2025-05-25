import type { Route } from "./+types/home";
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
		<div className="flex flex-col items-center justify-center h-screen gap-4">
			<h1 className="text-4xl font-bold mb-8">HereNow</h1>
			<div className="flex gap-4">
				<Button asChild>
					<Link to="/landing">서비스 소개</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link to="/login">로그인하기</Link>
				</Button>
				<Button variant="secondary" asChild>
					<Link to="https://miumiupoly.pages.dev/" target="_blank">
						내 블로그로 이동
					</Link>
				</Button>
			</div>
		</div>
	);
}
