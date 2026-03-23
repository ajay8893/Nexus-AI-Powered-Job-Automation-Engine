import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, TrendingUp, Zap } from 'lucide-react';

const stats = [
	{
		label: 'Total Applications',
		value: '120',
		icon: Send,
		trend: '+12% this month',
	},
	{
		label: 'Interview Rate',
		value: '12%',
		icon: MessageSquare,
		trend: '+2% from last week',
	},
	{ label: 'Profile Strength', value: '85%', icon: Zap, trend: 'Advanced' },
];

const DashboardPage = () => {
	return (
		<div className="space-y-2 w-full mx-auto pb-8">
			<div className="flex items-center justify-between w-full px-10">
				<div className="flex flex-col">
					<h2 className="text-2xl font-bold tracking-tight">
						Welcome back, Ajay!
					</h2>
					<p className="text-sm text-muted-foreground mt-1">
						Track your progress and upcoming milestones
					</p>
				</div>
				<Button className="bg-digital-blue-600 hover:bg-digital-blue-700 text-white">
					<Zap className="mr-2 h-4 w-4" /> Start Tailoring
				</Button>
			</div>

			{/* Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-20 mx-auto mt-8">
				{stats.map((stat, i) => (
					<Card
						key={i}
						className="border-gray-50/10 bg-white/5 backdrop-blur-2xl overflow-hidden relative"
					>
						{/* Subtle decorative gradient */}
						<div className="absolute top-0 right-0 p-3 opacity-10">
							<stat.icon size={80} strokeWidth={1} />
						</div>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								{stat.label}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className="text-xs text-digital-blue-500/80 mt-1 flex items-center">
								<TrendingUp size={12} className="mr-1" /> {stat.trend}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Bottom Grid: Main Content Areas */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-20 mt-6">
				{/* Main Activity / Chart Area */}
				<Card className="col-span-1 lg:col-span-8 border-gray-50/10 bg-white/5 backdrop-blur-2xl min-h-[400px]">
					<CardHeader>
						<CardTitle className="text-lg">Application Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-[300px] w-full flex items-center justify-center border-2 border-dashed border-gray-50/10 rounded-xl">
							<p className="text-muted-foreground">Activity Chart goes here</p>
						</div>
					</CardContent>
				</Card>

				{/* Sidebar / Quick Actions Area */}
				<Card className="col-span-1 lg:col-span-4 border-gray-50/10 bg-white/5 backdrop-blur-2xl min-h-[400px]">
					<CardHeader>
						<CardTitle className="text-lg">Recent Alerts</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Sample Alert Item */}
						{[1, 2, 3].map((_, i) => (
							<div
								key={i}
								className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-digital-blue-500/30 transition-colors cursor-pointer"
							>
								<div className="size-2 mt-2 rounded-full bg-digital-blue-500 shrink-0" />
								<div>
									<p className="text-sm font-medium">New Interview Request</p>
									<p className="text-xs text-muted-foreground">
										Google • 2 hours ago
									</p>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default DashboardPage;
