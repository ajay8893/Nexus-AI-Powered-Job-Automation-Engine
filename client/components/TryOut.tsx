import Link from 'next/link';
import { Button } from './ui/button';

const TryOut = () => {
	return (
		<section className="py-20 px-6">
			<div className="max-w-7xl mx-auto">
				<div className="relative overflow-hidden max-w-5xl rounded-3xl mx-auto py-16 px-6 md:py-24 flex flex-col items-center text-center gap-6 bg-digital-blue-400 shadow-2xl shadow-digital-blue-200 dark:shadow-none dark:bg-digital-blue-600">
					<div className="relative z-10 flex flex-col gap-4 items-center">
						<h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
							Ready to Upgrade Your Career?
						</h2>
						<p className="text-base md:text-lg text-digital-blue-100 max-w-xl">
							Join thousands of job seekers using AI to land higher-paying roles
							faster
						</p>
					</div>
					<div className="relative z-10 w-full sm:w-auto mt-6">
						<Link href="/sign-up">
							<Button className="w-full sm:w-auto py-7 px-8 bg-white hover:bg-digital-blue-50 text-digital-blue-600 text-md font-bold rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer">
								Get Started for Free Today
							</Button>
						</Link>
					</div>
					<p className="relative z-10 text-sm md:text-sm text-digital-blue-50 font-medium">
						No credit card required. free 14-day trial on Pro features.
					</p>
				</div>
			</div>
		</section>
	);
};

export default TryOut;
