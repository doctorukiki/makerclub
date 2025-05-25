import { ReactNode } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<div className="flex flex-1">
				<Sidebar />
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}
