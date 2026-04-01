'use client';

import { useEffect, useState } from 'react';
import { authClient, useSession } from '@/lib/auth-client';
import {
	Briefcase,
	ChevronsUpDown,
	LayoutDashboard,
	LogOutIcon,
	Scissors,
	Settings,
	Sparkles,
	User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ModeToggle } from './ui/ModeToggle';
import { Separator } from './ui/separator';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from './ui/sidebar';

const navItems = [
	{
		title: 'Dashboard',
		icon: LayoutDashboard,
		path: '/dashboard',
	},
	{
		title: 'Tailor Station',
		icon: Scissors,
		path: '/tailor-station',
	},
	{
		title: 'Application Tracker',
		icon: Briefcase,
		path: '/application-tracker',
	},
	{
		title: 'Profile',
		icon: User,
		path: '/profile',
	},
];

const AppSisebar = () => {
	const pathname = usePathname();
	const { state } = useSidebar();
	const router = useRouter();
	const [mounted, setMounted] = useState(false);

	const { data: session, isPending, error } = useSession();
	const isCollapsed = state === 'collapsed';

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleLogout = async () => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push('/sign-in');
				},
			},
		});
	};

	const user = session?.user;

	return (
		<Sidebar variant="floating" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" className="hover:bg-transparent">
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-digital-blue-500 text-white">
								<Sparkles strokeWidth={1} size={18} />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-bold text-lg tracking-wide">
									Nexus.
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<Separator />

			<SidebarContent className="mt-4">
				<SidebarGroup>
					<SidebarMenu>
						{navItems.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
									isActive={pathname === item.path}
									className={`py-5 mt-1`}
								>
									<Link href={item.path}>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				{/* Theme Toggle Group */}
				<SidebarGroup className="mt-auto">
					<SidebarMenu>
						<SidebarMenuItem className="flex items-center justify-between">
							{/* If collapsed, just show the button. If expanded, show label + button */}
							<ModeToggle />
							{!isCollapsed && (
								<span className="text-xs font-medium text-muted-foreground ml-1">
									Appearance
								</span>
							)}
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<Separator />
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						{!mounted ? (
							<SidebarMenuButton
								size="lg"
								className="cursor-pointer"
							>
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarFallback className="h-8 w-8 rounded-xl">
										{user?.name?.slice(0, 2).toUpperCase() || '..'}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{user?.name || 'Loading...'}</span>
									<span className="truncate text-xs text-muted-foreground">
										{user?.email || ''}
									</span>
								</div>
								<ChevronsUpDown size={18} className="ml-4" />
							</SidebarMenuButton>
						) : (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-muted data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
								>
									<Avatar className="h-8 w-8 rounded-lg">
										{user?.image ? (
											<AvatarImage src={user?.image} alt={user?.name} />
										) : (
											<AvatarFallback className="h-8 w-8 rounded-xl">
												{user?.name?.slice(0, 2).toUpperCase()}
											</AvatarFallback>
										)}
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">{user?.name}</span>
										<span className="truncate text-xs text-muted-foreground">
											{user?.email}
										</span>
									</div>
									<ChevronsUpDown size={18} className="ml-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								side="right"
								align="end"
								sideOffset={28}
								alignOffset={30}
							>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar className="h-8 w-8 rounded-lg">
											{user?.image ? (
												<AvatarImage src={user?.image} alt={user?.name} />
											) : (
												<AvatarFallback className="h-8 w-8 rounded-xl">
													{user?.name?.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											)}
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">
												{user?.name}
											</span>
											<span className="truncate text-xs text-muted-foreground">
												{user?.email}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>

								<DropdownMenuSeparator />

								<DropdownMenuGroup>
									<DropdownMenuItem className="p-2">
										<Link
											href="#"
											className="flex gap-1 items-center justify-center"
										>
											<Sparkles className="mr-2 size-4" />
											Upgrade to Pro
										</Link>
									</DropdownMenuItem>
								</DropdownMenuGroup>

								<DropdownMenuGroup>
									<DropdownMenuItem className="p-2">
										<Link
											href="/profile"
											className="flex gap-1 items-center justify-center cursor-pointer"
										>
											<Settings className="mr-2 size-4" />
											Settings
										</Link>
									</DropdownMenuItem>
								</DropdownMenuGroup>

								<DropdownMenuGroup>
									<DropdownMenuItem
										className="p-2 text-destructive focus:bg-destructive/10 hover:text-destructive cursor-pointer"
										onSelect={(e) => handleLogout()}
									>
										<LogOutIcon className="mr-2 size-4" />
										Logout
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
						)}
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSisebar;
