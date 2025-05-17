import { Link } from "react-router";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "./ui/navigation-menu";

export default function Navigation() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>메뉴 1</NavigationMenuTrigger>
					<NavigationMenuContent>
						<NavigationMenuLink asChild>
							<Link to="/">Home</Link>
						</NavigationMenuLink>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>메뉴 2</NavigationMenuTrigger>
					<NavigationMenuContent>
						<NavigationMenuLink asChild>
							<Link to="https://miumiupoly.pages.dev/">
								내 블로그로
							</Link>
						</NavigationMenuLink>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
