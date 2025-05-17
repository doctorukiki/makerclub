import { Link } from "react-router";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "./ui/navigation-menu";

export default function Navigation() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>
						<Link to="/">Home</Link>
					</NavigationMenuTrigger>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
