import { Linkedin, Sparkles, Twitter } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
	return (
		<footer className="w-full border-t">
			<div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
				<div className="flex flex-col space-y-4">
					{/* logo */}
					<div className="flex items-center gap-2">
						<div className="border rounded-lg bg-digital-blue-500 p-1 text-white">
							<Link href="/">
								<Sparkles strokeWidth={1} size={20} />
							</Link>
						</div>
						<Link className="text-xl font-bold tracking-wide" href="/">
							Nexus.
						</Link>
					</div>
					{/* description */}
					<p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
						Nexus is an AI-powered job automation engine that helps you find and
						apply for jobs that match your skills and interests.
					</p>
					{/* social */}
					<div className="flex gap-4 ml-2 dark:text-white">
						<Twitter  strokeWidth={1.5} size={20} />
						<Linkedin strokeWidth={1.5} size={20} />
					</div>
				</div>
				<div className="">
					<div className="space-y-4">
						<h3 className="font-semibold text-foreground">Product</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="hover:text-primary cursor-pointer transition-colors">
								Features
							</li>
							<li className="hover:text-primary cursor-pointer transition-colors">
								Resume AI
							</li>
							<li className="hover:text-primary cursor-pointer transition-colors">
								Job Tracker
							</li>
							<li className="hover:text-primary cursor-pointer transition-colors">
								Pricing
							</li>
						</ul>
					</div>
				</div>
				<div className="">
					<div className="space-y-4">
						<h3 className="font-semibold text-foreground">Company</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="hover:text-primary cursor-pointer transition-colors">
								About Us
							</li>
							<li className="hover:text-primary curhover:text-primary cursor-pointer transition-colors">
								Contact Us
							</li>
							<li className="hover:text-primary curhover:text-primary cursor-pointer transition-colors">
								Careers
							</li>
							<li className="hover:text-primary curhover:text-primary cursor-pointer transition-colors">
								Blog
							</li>
						</ul>
					</div>
				</div>
				<div className="">
					<div className="space-y-4">
						<h3 className="font-semibold text-foreground">Support</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="hover:text-primary cursor-pointer transition-colors">
								Help Center
							</li>
							<li className="hover:text-primary cursor-pointer transition-colors">
								Terms of Service
							</li>
							<li className="hover:text-primary cursor-pointer transition-colors">
								Privacy Policy
							</li>
							<li className="hover:text-primary cursor-pointer transition-colors">
								Security
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="border-t">
				<div className="max-w-7xl mx-auto px-6 py-2 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-muted-foreground text-xs">
						© 2026 Nexus. All rights reserved.
					</p>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
						</span>
						status: online
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
