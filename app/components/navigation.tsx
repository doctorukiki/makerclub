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

const menus = [
	{
		name: "Home",
		to: "/home",
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
	return (
		<nav className="flex px-20 h-16 items-center justify-between backdrop-blur fixed top-0 left-0 right-0 z-50 bg-background/50">
			<div className="flex items-center">
				<Link to="/" className="font-bold tracking-tighter text-lg">
					herenow
				</Link>
				<Separator orientation="vertical" className="h-6 mx-4" />
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
											<ul className="grid w-[600px] font-light gap-3 p-4 grid-cols-2">
												{menu.items?.map((item) => (
													<NavigationMenuItem
														key={item.name}
														className={cn([
															"select-none rounded-md transition-colors focus:bg-accent  hover:bg-accent",
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
																	{item.name}
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
		</nav>
	);
}
