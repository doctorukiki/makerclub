import { ShineBorder } from "components/magicui/shine-border";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";

export default function Header() {
	return (
		<header className="sticky top-0 z-10 border-b bg-background">
			<div className="flex h-16 items-center justify-between px-6">
				<div className="flex items-center gap-6">
					<Link
						to="/home"
						className="flex items-center gap-2 font-bold text-xl"
					>
						HereNow
					</Link>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link to="/" className="px-4 py-2">
									서비스 소개
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger>
									호스트 되기
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid gap-3 p-4 w-[200px]">
										<li>
											<NavigationMenuLink asChild>
												<Link
													to="/host/guide"
													className="block p-2 hover:bg-accent rounded-md"
												>
													호스트 가이드
												</Link>
											</NavigationMenuLink>
										</li>
										<li>
											<NavigationMenuLink asChild>
												<Link
													to="/host/apply"
													className="block p-2 hover:bg-accent rounded-md"
												>
													호스트 신청하기
												</Link>
											</NavigationMenuLink>
										</li>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger>
									만남
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid gap-3 p-4 w-[200px]">
										<li>
											<NavigationMenuLink asChild>
												<Link
													to="/meetups/explore"
													className="block p-2 hover:bg-accent rounded-md"
												>
													만남 찾기
												</Link>
											</NavigationMenuLink>
										</li>
										<li>
											<NavigationMenuLink asChild>
												<Link
													to="/meetups/my"
													className="block p-2 hover:bg-accent rounded-md"
												>
													내 만남 관리
												</Link>
											</NavigationMenuLink>
										</li>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link to="/stories" className="px-4 py-2">
									스토리
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="flex items-center gap-4">
					<Button variant="ghost" asChild>
						<Link to="/login">로그인</Link>
					</Button>

					<div className="relative rounded-md">
						<Button size="lg" variant="outline" asChild>
							<Link to="/signup">회원가입</Link>
						</Button>

						<ShineBorder
							shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
