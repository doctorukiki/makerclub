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
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { BorderBeam } from "components/magicui/border-beam";

const menus = [
	{
		name: "홈",
		to: "/landing_glow",
	},
	{
		name: "커뮤니티",
		items: [
			{
				name: "스토리",
				description: "실제 유저들의 만남 스토리를 확인하세요",
				to: "/stories",
			},
			{
				name: "호스트",
				description: "현지 호스트들과 연결되어 보세요",
				to: "/hosts",
			},
		],
	},
	{
		name: "도움말",
		items: [
			{
				name: "사용법",
				description: "Here&Now 사용법을 알아보세요",
				to: "/help",
			},
			{
				name: "FAQ",
				description: "자주 묻는 질문들",
				to: "/faq",
			},
		],
	},
];

export default function NavigationGlow() {
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
		<nav className="flex px-4 sm:px-6 lg:px-20 h-16 items-center justify-between fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-500/20">
			{/* 배경 글로우 */}
			<div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5" />

			<div className="flex h-16 items-center relative z-10">
				<Link
					to="/"
					className="font-bold tracking-tighter text-xl mr-4 sm:mr-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
				>
					<span className="flex items-center">
						<Sparkles className="w-5 h-5 mr-2 text-purple-400" />
						Here&Now
					</span>
				</Link>

				{/* 데스크탑 메뉴 */}
				<div className="hidden md:block">
					<NavigationMenu>
						<NavigationMenuList>
							{menus.map((menu) => (
								<NavigationMenuItem key={menu.name}>
									{menu.items ? (
										<>
											<NavigationMenuTrigger className="bg-transparent text-gray-300 hover:text-white hover:bg-purple-500/10 data-[state=open]:bg-purple-500/10">
												{menu.name}
											</NavigationMenuTrigger>
											<NavigationMenuContent className="bg-black/95 backdrop-blur-md border border-purple-500/20">
												<ul className="grid w-[300px] sm:w-[400px] lg:w-[500px] font-light gap-3 p-4 grid-cols-1 sm:grid-cols-2">
													{menu.items?.map((item) => (
														<NavigationMenuItem
															key={item.name}
															className="select-none rounded-md transition-colors hover:bg-purple-500/10 focus:bg-purple-500/10"
														>
															<NavigationMenuLink
																asChild
															>
																<Link
																	className="p-3 space-y-1 block leading-none no-underline outline-none"
																	to={item.to}
																>
																	<span className="text-sm font-medium leading-none text-white">
																		{
																			item.name
																		}
																	</span>
																	<p className="text-sm leading-snug text-gray-400">
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
											className={cn(
												navigationMenuTriggerStyle(),
												"bg-transparent text-gray-300 hover:text-white hover:bg-purple-500/10"
											)}
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
			<div className="flex items-center gap-2 sm:gap-4 relative z-10">
				<div className="hidden sm:block">
					<Button
						variant="outline"
						className="border-purple-500/50 text-purple-100 hover:text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/70 backdrop-blur-sm bg-purple-700/20"
						asChild
					>
						<Link to="/login">로그인</Link>
					</Button>
				</div>

				<div className="relative">
					<Button
						className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
						asChild
					>
						<Link to="/signup_glow">회원가입</Link>
					</Button>
					<BorderBeam />
				</div>

				{/* 모바일 메뉴 버튼 */}
				<div className="md:hidden">
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleMenu}
						className="bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-white"
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</Button>
				</div>
			</div>

			{/* 모바일 메뉴 */}
			{isMenuOpen && (
				<div className="fixed inset-x-0 top-16 bottom-0 z-40 bg-black/95 backdrop-blur-md border-t border-purple-500/20 pt-2 md:hidden overflow-y-auto h-[calc(100vh-4rem)]">
					<div className="space-y-4 px-4 py-6 min-h-[100%]">
						{menus.map((menu) => (
							<div
								key={menu.name}
								className="py-2 border-b border-purple-500/20"
							>
								{menu.items ? (
									<>
										<Link
											to={menu.to ?? "/"}
											className="flex flex-row justify-between items-center font-medium text-lg py-3 px-2 text-white bg-purple-500/10 rounded-md"
											onClick={closeMenu}
										>
											{menu.name}
										</Link>
										<div className="pl-4 space-y-2 mt-2">
											{menu.items?.map((item) => (
												<Link
													key={item.name}
													to={item.to}
													className="block py-3 px-3 text-gray-300 bg-purple-500/5 rounded-md mt-1 hover:bg-purple-500/10 hover:text-white transition-colors"
													onClick={closeMenu}
												>
													<div className="font-medium">
														{item.name}
													</div>
													<div className="text-sm text-gray-400 mt-1">
														{item.description}
													</div>
												</Link>
											))}
										</div>
									</>
								) : (
									<Link
										to={menu.to}
										className="block font-medium text-lg py-3 px-2 text-white bg-purple-500/10 rounded-md hover:bg-purple-500/20 transition-colors"
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
								className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 h-12 text-base backdrop-blur-sm"
								asChild
							>
								<Link to="/login" onClick={closeMenu}>
									로그인
								</Link>
							</Button>
							<div className="relative">
								<Button
									className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
									asChild
								>
									<Link to="/signup_glow" onClick={closeMenu}>
										회원가입
									</Link>
								</Button>
								<BorderBeam />
							</div>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
