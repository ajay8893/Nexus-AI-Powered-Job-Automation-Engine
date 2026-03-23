'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	CheckCircle2,
	Download,
	Eye,
	Link as LinkIcon,
	RotateCcw,
	Sparkles,
} from 'lucide-react';
import { useState } from 'react';

const TailorStationPage = () => {
	const [url, setUrl] = useState('');
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	return (
		<div className="flex flex-col h-[calc(100vh-120px)] gap-6 w-full max-w-7xl mx-auto">
			{/* Top Bar: URL & Quick Actions */}
			<div className="flex flex-col md:flex-row gap-4 items-end bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
				<div className="flex-1 w-full space-y-2">
					<label className="text-xs font-medium text-muted-foreground ml-1">
						Job Posting URL
					</label>
					<div className="relative">
						<LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
						<Input
							placeholder="https://linkedin.com/jobs/view/..."
							className="pl-10 bg-black/20 border-white/10 focus-visible:ring-digital-blue-500"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
						/>
					</div>
				</div>
				<Button
					onClick={() => setIsAnalyzing(true)}
					className="bg-digital-blue-600 hover:bg-digital-blue-700 text-white w-full md:w-auto px-8"
				>
					{isAnalyzing ? 'Processing...' : 'Analyze URL'}
					<Sparkles className="ml-2 size-4" />
				</Button>
			</div>

			{/* Main Split Screen */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
				{/* LEFT: Current Resume & Inputs */}
				<div className="flex flex-col gap-4 overflow-hidden">
					<Tabs defaultValue="original" className="flex-1 flex flex-col">
						<div className="flex items-center justify-between mb-2">
							<TabsList className="bg-white/5 border border-white/10">
								<TabsTrigger value="original">Original Resume</TabsTrigger>
								<TabsTrigger value="jd">Job Description</TabsTrigger>
							</TabsList>
							<Badge
								variant="outline"
								className="text-digital-blue-400 border-digital-blue-400/30"
							>
								Match Score: 65%
							</Badge>
						</div>

						<TabsContent value="original" className="flex-1 mt-0">
							<Card className="h-full bg-white/5 border-white/10 overflow-hidden">
								<ScrollArea className="h-full p-4">
									{/* This would be your PDF Previewer or Text View */}
									<div className="space-y-4 opacity-60 pointer-events-none select-none">
										<h3 className="text-xl font-bold">Ajay M.</h3>
										<p className="text-sm">Fullstack Developer</p>
										<div className="h-4 w-full bg-white/10 rounded" />
										<div className="h-4 w-[80%] bg-white/10 rounded" />
										<div className="h-4 w-[90%] bg-white/10 rounded" />
									</div>
									<div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
										<Button
											variant="outline"
											className="bg-black/40 border-white/20"
										>
											<Eye className="mr-2 size-4" /> View PDF
										</Button>
									</div>
								</ScrollArea>
							</Card>
						</TabsContent>

						<TabsContent value="jd" className="flex-1 mt-0">
							<Card className="h-full bg-white/5 border-white/10">
								<textarea
									className="w-full h-full bg-transparent p-4 outline-none resize-none text-sm text-muted-foreground"
									placeholder="Paste job description here if URL fetch fails..."
								/>
							</Card>
						</TabsContent>
					</Tabs>
				</div>

				{/* RIGHT: AI Generated Live Preview */}
				<div className="flex flex-col gap-4 overflow-hidden">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-sm font-semibold flex items-center gap-2">
							<Sparkles className="size-4 text-digital-blue-500" />
							Nexus AI Optimization
						</h3>
						<div className="flex gap-2">
							<Button variant="ghost" size="sm" className="h-8 text-xs">
								<RotateCcw className="mr-1 size-3" /> Regenerate
							</Button>
							<Button
								size="sm"
								className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
							>
								<Download className="mr-1 size-3" /> Export PDF
							</Button>
						</div>
					</div>

					<Card className="flex-1 border-digital-blue-500/30 bg-digital-blue-500/5 relative overflow-hidden group">
						{/* Animated "Scanning" Line effect when analyzing */}
						{isAnalyzing && (
							<div className="absolute top-0 left-0 w-full h-1 bg-digital-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan z-20" />
						)}

						<ScrollArea className="h-full p-6">
							<div className="space-y-6">
								{/* AI Suggested Improvements */}
								<div className="p-4 rounded-lg bg-digital-blue-500/10 border border-digital-blue-500/20">
									<p className="text-xs font-bold text-digital-blue-400 uppercase tracking-widest mb-2">
										AI Suggestion
									</p>
									<p className="text-sm italic">
										"Added 'Next.js Server Actions' and 'TypeScript' to match
										top skills found in the Google JD."
									</p>
								</div>

								{/* The Optimized Content */}
								<div className="space-y-4">
									<div className="flex items-center gap-2">
										<CheckCircle2 className="size-4 text-green-500" />
										<h3 className="text-xl font-bold">Ajay M.</h3>
									</div>
									<p className="text-sm text-digital-blue-300">
										Fullstack Developer | Next.js Specialist
									</p>
									<div className="space-y-2">
										<div className="h-4 w-full bg-white/20 rounded animate-pulse" />
										<div className="h-4 w-[90%] bg-white/20 rounded animate-pulse" />
										<div className="w-[95%] bg-digital-blue-500/30 rounded border border-digital-blue-500/50 p-4 h-auto text-xs leading-relaxed">
											Developed high-performance job automation engine (Nexus)
											using Next.js 15 and Better Auth, achieving 40% reduction
											in manual data entry for job seekers.
										</div>
									</div>
								</div>
							</div>
						</ScrollArea>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default TailorStationPage;
