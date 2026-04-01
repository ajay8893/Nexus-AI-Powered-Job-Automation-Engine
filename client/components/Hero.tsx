'use client';

import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';
import { Dot } from 'lucide-react';
import Link from 'next/link';
const Hero = () => {
	const { data: session } = useSession();
	return (
		<section className="w-full">
			<div className="max-w-7xl mx-auto flex flex-col items-center justify-center px-4 py-20 md:py-32 gap-6">
				<div className="border border-digital-blue-300 bg-digital-blue-100 text-digital-blue-600 font-semibold rounded-full px-4 py-1 text-[10px] md:text-xs uppercase flex items-center tracking-wider">
					<Dot className="animate-pulse" size={24} /> new: ai interview coach
				</div>
				<h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-tenter leading-[1.1] tracking-tight">
					Your AI-Powered Path to a <br className="hidden md:block" />
					<span className="block text-center bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-500">
						Better Career
					</span>
				</h1>
				<p className="max-w-2xl text-center text-base md:text-lg  text-muted-foreground mt-4 leading-relaxed">
					Unlock your professional potential with AI-driven resume tailoring,
					smart application tracking, and personalized skill gap analysis
					Landing your dream job has never been this data-driven.
				</p>
				<div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
					<Link href="/sign-up" className="w-full sm:w-auto">
						<Button
							className="w-full sm:w-auto px-8 py-7 text-lg font-bold bg-digital-blue-500 hover:bg-digital-blue-600
						 dark:text-white rounded-2xl shadow-lg shadow-digital-blue-200 dark:shadow-none transition-all hover:scale-105 cursor-pointer"
						>
							Get Started for Free
						</Button>
					</Link>
					{session && (
						<Link href="/dashboard" className="w-full sm:w-auto">
							<Button
								className="w-full sm:w-auto px-8 py-7 text-lg font-bold bg-digital-blue-500 hover:bg-digital-blue-600
						 dark:text-white rounded-2xl shadow-lg shadow-digital-blue-200 dark:shadow-none transition-all hover:scale-105 cursor-pointer"
							>
								Go to Dashboard
							</Button>
						</Link>
					)}
				</div>
			</div>
		</section>
	);
};

export default Hero;
