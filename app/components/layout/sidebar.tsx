import { Link } from "react-router";
import { Separator } from "~/components/ui/separator";

export default function Sidebar() {
	return (
		<aside className="hidden w-64 border-r bg-background lg:block">
			<div className="flex h-full flex-col">
				<div className="p-6">
					<h2 className="mb-4 text-lg font-semibold">마이페이지</h2>
					<nav className="space-y-1">
						<Link
							to="/profile"
							className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
						>
							프로필
						</Link>
						<Link
							to="/matches"
							className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
						>
							내 매칭
						</Link>
						<Link
							to="/chats"
							className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
						>
							메시지
						</Link>
						<Link
							to="/meetups"
							className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
						>
							만남 일정
						</Link>
					</nav>
				</div>
				<Separator />
				{/* 호스트 섹션 */}
				<div className="p-6">
					<h2 className="mb-4 text-lg font-semibold">호스트 섹션</h2>
					<nav className="space-y-1">
						<Link
							to="/host/dashboard"
							className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
						>
							대시보드
						</Link>
						<Link
							to="/host/requests"
							className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
						>
							매칭 요청
						</Link>
						<Link
							to="/host/earnings"
							className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
						>
							수익 관리
						</Link>
					</nav>
				</div>
				<div className="mt-auto p-6">
					<Link
						to="/settings"
						className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
					>
						설정
					</Link>
					<button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50">
						로그아웃
					</button>
				</div>
			</div>
		</aside>
	);
}
