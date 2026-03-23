import '@/app/globals.css';
import AppSisebar from '@/components/AppSisebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<TooltipProvider>
			<SidebarProvider className="flex h-screen">
				<AppSisebar />
				<div className="flex flex-col flex-1">
					<header className="flex h-14 shrink-0 items-center gap-2 px-2 sticky top-0 bg-background/95 backdrop-blur z-10">
						<SidebarTrigger size="icon-lg" className="-ml-1" />
						{/* Breadcrumbs placeholder */}
						<Breadcrumbs />
					</header>
					{/* breadcrumbs */}
					{/* TODO: header bredcrumbs */}
					{/* 3. The Content (Changes based on the route) */}
					<main className="flex-1 overflow-y-auto px-4 py-2">{children}</main>
				</div>
			</SidebarProvider>
		</TooltipProvider>
	);
}
