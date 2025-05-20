import { Link } from "react-router";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Separator } from "./ui/separator";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const menus = [
	{
		name: "home",
		to: "/",
	},
	{
		name: "Blog",

		items: [
			{
				name: "내 블로그로 이동",
				description: "let me introduce my blog powered by hugo",
				to: "https://miumiupoly.pages.dev/",
			},
		],
	},
	{
		name: "side-projects",

		items: [
			{
				name: "TaroAI",
				description:
					"An innovative tarot card service where AI reads your emotions and delivers personalized tarot readings.",
				to: "https://taroai.vercel.app/",
			},
		],
	},
];

export default function Navigation() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// 모바일 메뉴가 열려있을 때 스크롤 방지
	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isMenuOpen]);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	return (
		<nav className="flex px-4 sm:px-6 lg:px-20 h-16 items-center justify-between fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
			<div className="flex h-16 items-center">
				<Link
					to="/"
					className="font-bold tracking-tighter text-lg mr-4 sm:mr-8"
				>
					herenow
				</Link>

				{/* 데스크탑 메뉴 */}
				<div className="hidden md:block">
					<NavigationMenu>
						<NavigationMenuList>
							{menus.map((menu) => (
								<NavigationMenuItem key={menu.name}>
									{menu.items ? (
										<>
											<Link to={menu.to ?? "/"}>
												<NavigationMenuTrigger>
													{menu.name}
												</NavigationMenuTrigger>
											</Link>
											<NavigationMenuContent>
												<ul className="grid w-[300px] sm:w-[400px] lg:w-[600px] font-light gap-3 p-4 grid-cols-1 sm:grid-cols-2">
													{menu.items?.map((item) => (
														<NavigationMenuItem
															key={item.name}
															className={cn([
																"select-none rounded-md transition-colors focus:bg-accent hover:bg-accent",
																item.to ===
																	"/products/promote" &&
																	"col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
																item.to ===
																	"/jobs/submit" &&
																	"col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
															])}
														>
															<NavigationMenuLink
																asChild
															>
																<Link
																	className="p-3 space-y-1 block leading-none no-underline outline-none"
																	to={item.to}
																>
																	<span className="text-sm font-medium leading-none">
																		{
																			item.name
																		}
																	</span>
																	<p className="text-sm leading-snug text-muted-foreground">
																		{
																			item.description
																		}
																	</p>
																</Link>
															</NavigationMenuLink>
														</NavigationMenuItem>
													))}
												</ul>
											</NavigationMenuContent>
										</>
									) : (
										<Link
											className={navigationMenuTriggerStyle()}
											to={menu.to}
										>
											{menu.name}
										</Link>
									)}
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			</div>

			{/* 로그인/회원가입 버튼 */}
			<div className="flex items-center gap-2 sm:gap-4">
				<div className="hidden sm:block">
					<Button
						variant="outline"
						className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
						asChild
					>
						<Link to="/login">로그인</Link>
					</Button>
				</div>
				<div className="hidden sm:block">
					<Button asChild>
						<Link to="/signup">회원가입</Link>
					</Button>
				</div>

				{/* 모바일 메뉴 버튼 */}
				<div className="md:hidden">
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleMenu}
						className="bg-gray-100"
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</Button>
				</div>
			</div>

			{/* 모바일 메뉴 */}
			{isMenuOpen && (
				<div className="fixed inset-x-0 top-16 bottom-0 z-40 bg-white shadow-xl border-t border-gray-200 pt-2 md:hidden overflow-y-auto h-[calc(100vh-4rem)]">
					<div className="space-y-4 px-4 py-6 min-h-[100%]">
						{menus.map((menu) => (
							<div
								key={menu.name}
								className="py-2 border-b border-gray-100"
							>
								{menu.items ? (
									<>
										<Link
											to={menu.to ?? "/"}
											className="flex flex-row justify-between items-center font-medium text-lg py-3 px-2 text-gray-900 bg-gray-50 rounded-md"
											onClick={closeMenu}
										>
											{menu.name}
										</Link>
										<div className="pl-4 space-y-2 mt-2">
											{menu.items?.map((item) => (
												<Link
													key={item.name}
													to={item.to}
													className="block py-3 px-3 text-gray-700 bg-gray-50 rounded-md mt-1"
													onClick={closeMenu}
												>
													<div className="font-medium">
														{item.name}
													</div>
												</Link>
											))}
										</div>
									</>
								) : (
									<Link
										to={menu.to}
										className="block font-medium text-lg py-3 px-2 text-gray-900 bg-gray-50 rounded-md"
										onClick={closeMenu}
									>
										{menu.name}
									</Link>
								)}
							</div>
						))}
						<div className="flex flex-col gap-3 mt-8">
							<Button
								variant="outline"
								className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 h-12 text-base"
								asChild
							>
								<Link to="/login" onClick={closeMenu}>
									로그인
								</Link>
							</Button>
							<Button className="w-full h-12 text-base" asChild>
								<Link to="/signup" onClick={closeMenu}>
									회원가입
								</Link>
							</Button>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
