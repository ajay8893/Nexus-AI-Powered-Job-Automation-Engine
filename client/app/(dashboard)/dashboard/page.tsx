'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, TrendingUp, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

interface DashboardStats {
	totalApplications: number;
	interviewCount: number;
	interviewRate: number;
	statusCounts: Record<string, number>;
	recentApplications: any[];
	activityTimeline: { date: string; applications: number }[];
}

const chartConfig = {
	applications: {
		label: 'Applications',
		color: 'hsl(var(--primary))',
	},
} satisfies ChartConfig;

const DashboardPage = () => {
	const { data: session } = useSession();
	const [statsData, setStatsData] = useState<DashboardStats | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const firstName = session?.user?.name?.split(' ')[0] || 'User';

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setIsLoading(true);
				const res = await fetch('http://localhost:5001/api/applications/stats', {
					credentials: 'include',
				});
				if (res.ok) {
					const data = await res.json();
					setStatsData(data);
				}
			} catch (error) {
				console.error('Failed to fetch dashboard stats:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, []);

	const stats = [
		{
			label: 'Total Applications',
			value: statsData?.totalApplications?.toString() || '0',
			icon: Send,
			trend: 'Lifetime total',
		},
		{
			label: 'Interview Rate',
			value: `${statsData?.interviewRate || 0}%`,
			icon: MessageSquare,
			trend: 'Based on status',
		},
		{ 
			label: 'Profile Strength', 
			value: '85%', 
			icon: Zap, 
			trend: 'Advanced' 
		},
	];

	return (
		<div className="space-y-2 w-full mx-auto pb-8">
			<div className="flex items-center justify-between w-full px-10">
				<div className="flex flex-col">
					<h2 className="text-2xl font-bold tracking-tight">
						Welcome back, {firstName}!
					</h2>
					<p className="text-sm text-muted-foreground mt-1">
						Track your progress and upcoming milestones
					</p>
				</div>
				<Link href="/tailor-station">
					<Button className="bg-digital-blue-600 hover:bg-digital-blue-700 text-white">
						<Zap className="mr-2 h-4 w-4" /> Start Tailoring
					</Button>
				</Link>
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
							{isLoading ? (
								<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
							) : (
								<>
									<div className="text-2xl font-bold">{stat.value}</div>
									<p className="text-xs text-digital-blue-500/80 mt-1 flex items-center">
										<TrendingUp size={12} className="mr-1" /> {stat.trend}
									</p>
								</>
							)}
						</CardContent>
					</Card>
				))}
			</div>

			{/* Bottom Grid: Main Content Areas */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-20 mt-6">
				{/* Main Activity Chart Area */}
				<Card className="col-span-1 lg:col-span-8 border-gray-50/10 bg-white/5 backdrop-blur-2xl min-h-[400px]">
					<CardHeader>
						<CardTitle className="text-lg">Application Activity</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="flex items-center justify-center h-[300px]">
								<Loader2 className="h-8 w-8 animate-spin text-primary" />
							</div>
						) : statsData?.activityTimeline && statsData.activityTimeline.length > 0 ? (
							<ChartContainer config={chartConfig} className="h-[300px] w-full">
								<AreaChart data={statsData.activityTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
									<defs>
										<linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="var(--color-applications)" stopOpacity={0.3}/>
											<stop offset="95%" stopColor="var(--color-applications)" stopOpacity={0}/>
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
									<XAxis 
										dataKey="date" 
										tickLine={false} 
										axisLine={false} 
										tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }} 
										tickFormatter={(val) => {
											const d = new Date(val);
											return `${d.getMonth() + 1}/${d.getDate()}`;
										}}
									/>
									<YAxis 
										tickLine={false} 
										axisLine={false} 
										tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }} 
										allowDecimals={false} 
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Area 
										type="monotone" 
										dataKey="applications" 
										stroke="var(--color-applications)" 
										fillOpacity={1} 
										fill="url(#colorApps)" 
									/>
								</AreaChart>
							</ChartContainer>
						) : (
							<div className="h-[300px] w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-50/10 rounded-xl">
								<p className="text-muted-foreground">Not enough data for chart</p>
								<Link href="/tailor-station" className="mt-4">
									<Button variant="outline" size="sm">Get Started</Button>
								</Link>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Sidebar / Quick Actions & Recent Apps */}
				<div className="col-span-1 lg:col-span-4 space-y-6">
					<Card className="border-gray-50/10 bg-white/5 backdrop-blur-2xl">
						<CardHeader>
							<CardTitle className="text-lg">Quick Actions</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<Link href="/tailor-station" className="block w-full">
								<Button variant="outline" className="w-full justify-start border-foreground/10 hover:bg-foreground/5 shadow-sm">
									<Scissors className="mr-2 h-4 w-4 text-primary" /> Tailor New Resume
								</Button>
							</Link>
							<Link href="/application-tracker" className="block w-full">
								<Button variant="outline" className="w-full justify-start border-foreground/10 hover:bg-foreground/5 shadow-sm">
									<Briefcase className="mr-2 h-4 w-4 text-primary" /> View Tracker
								</Button>
							</Link>
						</CardContent>
					</Card>
					
					<Card className="border-gray-50/10 bg-white/5 backdrop-blur-2xl">
						<CardHeader>
							<CardTitle className="text-lg">Recent Applications</CardTitle>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="flex items-center justify-center py-4">
									<Loader2 className="h-6 w-6 animate-spin text-primary" />
								</div>
							) : statsData?.recentApplications && statsData.recentApplications.length > 0 ? (
								<div className="space-y-3">
									{statsData.recentApplications.map((app) => (
										<div key={app._id} className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-border transition-colors">
											<div className="flex justify-between items-start">
												<p className="font-semibold text-sm line-clamp-1">{app.jobTitle}</p>
												<span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider shrink-0 ${
													app.status === 'Applied' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
													app.status === 'Interviewing' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
													app.status === 'Offer' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
													'bg-slate-500/10 text-slate-500 border border-slate-500/20'
												}`}>
													{app.status}
												</span>
											</div>
											<p className="text-xs text-muted-foreground">{app.companyName} • {app.location || 'Remote'}</p>
										</div>
									))}
								</div>
							) : (
								<div className="py-6 flex flex-col items-center justify-center text-center opacity-50">
									<p className="text-xs italic">No applications yet</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

// Mock icon for the quick actions
const Briefcase = ({ className, ...props }: any) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
		{...props}
	>
		<rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
		<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
	</svg>
);

const Scissors = ({ className, ...props }: any) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
		{...props}
	>
		<circle cx="6" cy="6" r="3" />
		<path d="M8.12 8.12 12 12" />
		<path d="M20 4 8.12 15.88" />
		<circle cx="6" cy="18" r="3" />
		<path d="M8.12 15.88 12 12" />
		<path d="M20 20 8.12 8.12" />
	</svg>
);

export default DashboardPage;
