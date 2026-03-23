import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ModeToggle } from './ui/ModeToggle';
import { Button } from './ui/button';

// const navLinks = [
// 	{ href: '/', label: 'Home' },
// 	{ href: '/pricing', label: 'Pricing' },
// 	{ href: '/testimonial', label: 'Testimonial' },
// 	{ href: '/resourses', label: 'Resources' },
// ];
const NavBar = () => {
	return (
		<header className="w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
			<nav className="flex items-center justify-between h-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-2 shrink-0">
					<div className="border rounded-lg bg-digital-blue-500 p-1.5 text-white">
						<Link href="/">
							<Sparkles strokeWidth={1.5} size={20} />
						</Link>
					</div>
					<Link
						className="text-xl font-bold tracking-tight hidden sm:block"
						href="/"
					>
						Nexus.
					</Link>
				</div>
				{/* <div className="md:flex items-center gap-10">
					{navLinks.map((link) => (
						<Link key={link.label} href={link.href}>
							{link.label}
						</Link>
					))}
				</div> */}
				<div className="flex items-center gap-6">
					<div className="flex items-center">
						<Link href="/sign-in">
							<Button className="px-4 h-9 bg-digital-blue-500 font-semibold rounded-[10px] dark:text-white cursor-pointer hover:bg-digital-blue-500/90 hover:font-bold">
								SignIn
							</Button>
						</Link>
					</div>
					<div className="">
						<ModeToggle />
					</div>
				</div>
			</nav>
		</header>
	);
};

export default NavBar;
