const Testimonials = () => {
	return (
		<section className="px-6 overflow-hidden">
			<div className=" relative mx-auto flex flex-col md:flex-row gap-16 lg;gap-10 max-w-7xl items-start">
				{/* left */}
				<div className="flex flex-col items-start lg:w-1/3 shrink-0">
					<p className="text-digital-blue-500 font-semibold tracking-wide uppercase text-sm">
						success stories
					</p>
					<h2 className="text-4xl md:text-5xl font-extrabold mt-4 tracking-tight">
						What our <br className="hidden lg:block" /> users say
					</h2>
					<div className="flex items-center gap-3 mt-8 border-l-2 border-digital-blue-500 pl-4">
						<p className="text-base max-w-sm text-muted-foreground">
							Join over 50,000 professionals who transformed their job search
							with AI Career Pro.
						</p>
					</div>
				</div>
				{/* right */}
				<div className="relative w-full lg:h-[400px] flex flex-col gap-6 lg:block">
					<div className="lg:absolute lg:top-0 lg:left-10 flex flex-col bg-digital-blue-200/60 border w-full lg:w-[450px] p-8 rounded-2xl gap-4 shadow-lg shadow-digital-blue-100 z-20 dark:shadow-none dark:bg-digital-blue-600">
						<p className="text-sm text-black/70 italic leading-relaxed dark:text-white/80">
							"I was struggling for months to get even a screening call. AI
							Career Pro helped me tailor my resume in seconds, and I landed 3
							interviews in my first week using it."
						</p>
						<div className="flex flex-col md:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
							<p className="font-bold">Sarah Jenkins</p>
							<span className="hidden sm:inline text-muted-foreground">|</span>
							<p className="text-muted-foreground">Product Designer @ Meta</p>
						</div>
					</div>

					<div className="lg:absolute lg:top-50 lg:left-40 flex flex-col border w-full lg:w-[450px] p-8 gap-4 bg-digital-blue-200/60 rounded-2xl shadow-xl shadow-digital-blue-100 z-10 dark:bg-digital-blue-600 dark:shadow-none">
						<p className="text-sm leading-relaxed italic text-black/70 dark:text-white/80">
							"The skill gap analysis was a game-changer. It told me exactly
							what certifications were trending in my field, helping me secure a
							40% salary increase."
						</p>
						<div className="flex flex-col md:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
							<p className="font-semibold">Marcus Thome</p>
							<span className="hidden sm:inline text-muted-foreground">|</span>
							<p className="text-muted-foreground">
								Sr. Software Engineer @ Stripe
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
