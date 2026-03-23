import { Feature } from '@/types/types';
import { ArrowRight, ChartNoAxesCombined, FileText, Form } from 'lucide-react';

const features: Feature[] = [
	{
		id: 1,
		icon: <FileText size={20} />,
		title: 'AI Resume Tailoring',
		description:
			'Automatically optimize your resume for every job description. Our AI analyzes keywords and sentiment to ensure you pass ATS filters.',
	},
	{
		id: 2,
		icon: <Form size={20} />,
		title: 'Application Tracking',
		description:
			'Stay organized with a smart kanban board. Automatically import job details and track every stage from application to offer.',
	},
	{
		id: 3,
		icon: <ChartNoAxesCombined size={20} />,
		title: 'Skill Match Analysis',
		description:
			'Identify which skills you need to land your dream role. Get personalized learning paths based on current market data and trends.',
	},
];

const Features = () => {
	return (
		<section className="py-20 px-6">
			<div className="max-w-7xl mx-auto my-20 flex flex-col gap-16">
				<div className="flex flex-col items-center text-center gap-4">
					<p className="uppercase text-xs tracking-widest font-bold text-digital-blue-500">
						core capabilities
					</p>
					<h2 className="text-3xl md:text-5xl font-bold tracking-tight">
						Supercharge Your Job Search
					</h2>
					<p className="text-muted-foreground max-w-2xl text-balance">
						Our suite of AI tools is designed to give you a competitive edge in
						the modern job market.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature) => (
						<div
							key={feature.id}
							className="group flex flex-col justify-between p-8 border border-digital-blue-200/20 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl bg-digital-blue-100/60 dark:bg-digital-blue-700"
						>
							<div className="space-y-4">
								<div className="text-digital-blue-700 bg-digital-blue-200 w-12 h-12 rounded-lg flex items-center justify-center">
									{feature.icon}
								</div>
								<h3 className="text-xl font-bold dark:text-white">
									{feature.title}
								</h3>
								<p className="text-sm leading-relaxed text-muted-foreground dark:text-digital-blue-200/80">
									{feature.description}
								</p>
								<div className="mt-8 flex items-center gap-2 text-sm text-digital-blue-500 font-bold cursor-pointer group-hover:gap-3 transition-all dark:text-digital-blue-200">
									Learn More <ArrowRight strokeWidth={3} size={14} />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;
