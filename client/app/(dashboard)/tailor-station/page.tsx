'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link as LinkIcon, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tailorSchema, TailorInput } from '@/lib/validations/tailor';
import { toast } from 'sonner';

const TailorStationPage = () => {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<TailorInput>({
		resolver: zodResolver(tailorSchema),
		defaultValues: {
			jobUrl: '',
			jobDescription: '',
			companyName: '',
			jobTitle: '',
		},
	});

	const formValues = watch();

	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [aiText, setAiText] = useState('');
	const [matchScore, setMatchScore] = useState<string | null>(null);
	const [existingKeywords, setExistingKeywords] = useState<string[]>([]);
	const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
	const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
	const [isTailoring, setIsTailoring] = useState(false);
	const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
	const [analysisNote, setAnalysisNote] = useState<string | null>(null);

	const eventSourceRef = useRef<EventSource | null>(null);
	const bottomRef = useRef<HTMLDivElement | null>(null);

	// Extract Match Score and Keywords from stream
	useEffect(() => {
		const scoreMatch = aiText.match(/\*\*Match Score\*\*:\s*(\d+)%/i);
		if (scoreMatch && scoreMatch[1]) {
			setMatchScore(scoreMatch[1]);
		}

		const existingMatch = aiText.match(/\*\*✅ Existing Keywords\*\*:\s*(.*)/i);
		if (existingMatch && existingMatch[1]) {
			const keywords = existingMatch[1]
				.split(',')
				.map((k) => k.trim())
				.filter((k) => k !== '' && !k.includes('[') && !k.includes(']'));
			setExistingKeywords(keywords);
		}

		const missingMatch = aiText.match(/\*\*❌ Missing Keywords\*\*:\s*(.*)/i);
		if (missingMatch && missingMatch[1]) {
			const keywords = missingMatch[1]
				.split(',')
				.map((k) => k.trim())
				.filter((k) => k !== '' && !k.includes('[') && !k.includes(']'));
			setMissingKeywords(keywords);
		}

		const noteMatch = aiText.match(/\*\*Note\*\*:\s*([^\n#]*)/i) || aiText.match(/^Note:\s*([^\n#]*)/mi);
		if (noteMatch && noteMatch[1]) {
			setAnalysisNote(noteMatch[1].trim());
		}
	}, [aiText]);
	
	const toggleKeyword = (kw: string) => {
		setSelectedKeywords((prev) =>
			prev.includes(kw) ? prev.filter((item) => item !== kw) : [...prev, kw],
		);
	};

	// Auto-scroll
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [aiText]);

	// Cleanup
	useEffect(() => {
		return () => {
			eventSourceRef.current?.close();
		};
	}, []);

	const handleAnalyze = async () => {
		try {
			setIsAnalyzing(true);
			setAiText('');
			setMatchScore(null);

			let currentJobDescription = formValues.jobDescription;

			// STEP 1: If there's a URL, scrape it first
			if (formValues.jobUrl) {
				const scrapeRes = await fetch('http://localhost:5001/api/scrape', {
					method: 'POST',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ url: formValues.jobUrl }),
				});

				if (scrapeRes.ok) {
					const data = await scrapeRes.json();
					currentJobDescription = data.description;

					setValue('jobDescription', data.description);
					setValue('jobTitle', data.title || (formValues.jobUrl ? new URL(formValues.jobUrl).hostname : 'Untitled Role'));
					setValue('companyName', data.companyName || 'Unknown Company');
				} else {
					console.warn('Failed to scrape job, using manual description');		
				}
			}

			if(!currentJobDescription) {
				throw new Error('No job description available. Please provide a URL or paste the description manually.');
			}


			// STEP 2: Create job
			const res = await fetch('http://localhost:5001/api/tailor', {
				method: 'POST',
				credentials: 'include', // send cookies
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jobDescription: currentJobDescription,
				}),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || 'Failed to create job');
			}

			const data = await res.json();
			const documentId = data.documentId;
			setCurrentDocumentId(documentId);

			// STEP 3: Stream
			const eventSource = new EventSource(
				`http://localhost:5001/api/tailor/stream/${documentId}`,
				{ withCredentials: true }, // IMPORTANT
			);

			eventSourceRef.current = eventSource;

			eventSource.onmessage = (event) => {
				const parsed = JSON.parse(event.data);

				if (parsed.error) {
					setAiText((prev) => prev + `\n\n**Error:** ${parsed.error}`);
				}

				if (parsed.text) {
					setAiText((prev) => prev + parsed.text);
				}

				if (parsed.done) {
					eventSource.close();
					setIsAnalyzing(false);
				}
			};

			eventSource.onerror = () => {
				console.error('SSE error');
				eventSource.close();
				setIsAnalyzing(false);
			};
		} catch (error: any) {
			console.error(error.message);
			setIsAnalyzing(false);
		}
	};

	const handleTailor = async () => {
		if (selectedKeywords.length === 0) return;

		try {
			setIsTailoring(true);
			setAiText(''); // Clear old text for new stream

			const res = await fetch('http://localhost:5001/api/tailor', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jobDescription: formValues.jobDescription,
					selectedKeywords,
				}),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || 'Failed to start tailoring');
			}

			const data = await res.json();
			const documentId = data.documentId;
			setCurrentDocumentId(documentId);

			const eventSource = new EventSource(
				`http://localhost:5001/api/tailor/stream/${documentId}`,
				{ withCredentials: true },
			);

			eventSourceRef.current = eventSource;

			eventSource.onmessage = (event) => {
				const parsed = JSON.parse(event.data);
				if (parsed.text) setAiText((prev) => prev + parsed.text);
				if (parsed.done) {
					eventSource.close();
					setIsTailoring(false);
				}
			};

			eventSource.onerror = () => {
				eventSource.close();
				setIsTailoring(false);
			};
		} catch (error: any) {
			console.error(error.message);
			setIsTailoring(false);
		}
	};

	const handleSaveToTracker = async () => {
		try {
			const res = await fetch('http://localhost:5001/api/applications', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					companyName: formValues.companyName || 'Unknown Company',
					jobTitle: formValues.jobTitle || 'Untitled Role',
					jobUrl: formValues.jobUrl,
					description: formValues.jobDescription,
					tailoredDocumentId: currentDocumentId,
					status: 'Draft',
				}),
			});

			if (res.ok) {
				alert('Application saved to tracker!');
			} else {
				const err = await res.json();
				throw new Error(err.error || 'Failed to save application');
			}
		} catch (error: any) {
			console.error('Error saving to tracker:', error.message);
			alert(`Error: ${error.message}`);
		}
	};

	return (
		<div className="flex flex-col h-[calc(100vh-120px)] gap-6 w-full max-w-7xl mx-auto overflow-hidden">
			{/* Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
				
				{/* LEFT: JOB CONTEXT (Col 1) */}
				<div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden">
					<Card className="flex-1 flex flex-col border-white/5 bg-black/20 p-4 gap-4 overflow-hidden">
						<div className="flex items-center gap-2 pb-2 border-b border-white/5">
							<LinkIcon className="size-4 text-primary" />
							<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Job Context</h3>
						</div>
						
						<div className="space-y-4 flex flex-col flex-1 overflow-hidden">
								<div className="space-y-3">
								<div className="space-y-1.5">
									<label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Job Title</label>
									<Input
										placeholder="e.g. Software Engineer"
										className="bg-black/40 border-white/10 h-9 text-sm"
										{...register('jobTitle')}
									/>
								</div>

								<div className="space-y-1.5">
									<label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Company Name</label>
									<Input
										placeholder="e.g. Google"
										className="bg-black/40 border-white/10 h-9 text-sm"
										{...register('companyName')}
									/>
								</div>

								<div className="space-y-1.5">
									<label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Job URL</label>
									<Input
										placeholder="https://linkedin.com/jobs/view/..."
										className="bg-black/40 border-white/10 h-9 text-sm"
										{...register('jobUrl')}
									/>
									{errors.jobUrl && <p className="text-[10px] text-red-500 px-1">{errors.jobUrl.message}</p>}
								</div>
							</div>

							<div className="space-y-1.5 flex-1 flex flex-col overflow-hidden">
								<label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Job Description</label>
								<div className="flex-1 min-h-[200px] border border-white/10 rounded-md bg-black/40 overflow-hidden">
									<textarea
										className="w-full h-full p-3 bg-transparent outline-none resize-none text-sm leading-relaxed"
										placeholder="Paste job description here..."
										{...register('jobDescription')}
									/>
								</div>
								{errors.jobDescription && <p className="text-[10px] text-red-500 px-1">{errors.jobDescription.message}</p>}
							</div>

							<Button 
								onClick={handleSubmit(handleAnalyze)} 
								className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
								disabled={isAnalyzing}
							>
								{isAnalyzing ? 'Processing...' : 'Analyze Job'}
								<Sparkles className="ml-2 size-4" />
							</Button>
						</div>
					</Card>
				</div>

				{/* MIDDLE: ANALYSIS (Col 2) */}
				<div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden">
					<Card className="h-full border-white/5 bg-black/20 p-4 flex flex-col gap-4 overflow-hidden">
						<div className="flex items-center gap-2 pb-2 border-b border-white/5">
							<Sparkles className="size-4 text-primary" />
							<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Analysis</h3>
						</div>

						<div className="space-y-6 overflow-y-auto pr-1 custom-scrollbar">
							<div className="bg-white/5 rounded-lg p-5 text-center border border-white/10">
								<p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Match Score</p>
								<div className={`text-4xl font-bold ${
									matchScore && Number(matchScore) > 75 ? 'text-green-500' : 'text-yellow-500'
								}`}>
									{matchScore || '0'}%
								</div>
							</div>

							<div className="space-y-3">
								<p className="text-[10px] uppercase font-bold text-green-500 flex items-center gap-2">
									<span className="size-1.5 rounded-full bg-green-500" />
									Existing Keywords
								</p>
								<div className="flex flex-wrap gap-1.5">
									{existingKeywords.length > 0 ? (
										existingKeywords.map((kw, i) => (
											<Badge key={i} variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px] py-0.5">
												{kw}
											</Badge>
										))
									) : (
										<p className="text-xs text-muted-foreground italic opacity-50">Waiting for analysis...</p>
									)}
								</div>
							</div>

									<div className="space-y-3">
										<p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
											<span className="size-1.5 rounded-full bg-white/20" />
											Missing Keywords (Click to Include)
										</p>
										<div className="flex flex-wrap gap-1.5">
											{missingKeywords.length > 0 ? (
												missingKeywords.map((kw, i) => (
													<Badge 
														key={i} 
														variant="secondary" 
														onClick={() => toggleKeyword(kw)}
														className={`cursor-pointer transition-all ${
															selectedKeywords.includes(kw)
																? 'bg-primary text-primary-foreground border-primary'
																: 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10'
														} text-[10px] py-0.5`}
													>
														{kw}
														{selectedKeywords.includes(kw) && <span className="ml-1">✓</span>}
													</Badge>
												))
											) : (
												<p className="text-xs text-muted-foreground italic opacity-50">Identifying skill gaps...</p>
											)}
										</div>
									</div>

									{selectedKeywords.length > 0 && (
										<Button 
											onClick={handleTailor} 
											className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white animate-in fade-in slide-in-from-bottom-2"
											disabled={isTailoring}
										>
											{isTailoring ? 'Tailoring Resume...' : `Tailor with ${selectedKeywords.length} Keywords`}
											<Sparkles className="ml-2 size-4" />
										</Button>
									)}

									{analysisNote && (
										<div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10 animate-in fade-in zoom-in-95 duration-500">
											<p className="text-[10px] uppercase font-bold text-primary mb-2 flex items-center gap-2">
												<Sparkles className="size-3" />
												AI Strategy Note
											</p>
											<p className="text-xs text-muted-foreground leading-relaxed italic">
												"{analysisNote}"
											</p>
										</div>
									)}
								</div>
					</Card>
				</div>

				{/* RIGHT: TAILORED RESUME (Col 3: Wider) */}
				<div className="lg:col-span-6 flex flex-col gap-4 overflow-hidden">
					<Card className="flex-1 flex flex-col border-white/5 bg-black/20 overflow-hidden">
								<div className="p-4 flex items-center justify-between border-b border-white/10 bg-white/5">
							<h2 className="text-base font-bold m-0 flex items-center gap-2">
								<Sparkles className="size-4 text-primary" />
								Tailored Resume
							</h2>
							<div className="flex items-center gap-3">
								{(isAnalyzing || isTailoring) && <div className="text-[10px] font-mono text-primary animate-pulse">Streaming Response...</div>}
								
								{currentDocumentId && aiText && !isAnalyzing && !isTailoring && (
									<Button 
										variant="outline" 
										size="sm" 
										className="h-8 text-xs bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary"
										onClick={() => window.open(`http://localhost:5001/api/tailor/download/${currentDocumentId}`, '_blank')}
									>
										Download ATS PDF
									</Button>
								)}

								{currentDocumentId && aiText && !isAnalyzing && !isTailoring && (
									<Button 
										variant="outline" 
										size="sm" 
										className="h-8 text-xs bg-indigo-600/10 border-indigo-600/20 hover:bg-indigo-600/20 text-indigo-400"
										onClick={handleSaveToTracker}
									>
										Save to Tracker
									</Button>
								)}
							</div>
						</div>
						
						<ScrollArea className="flex-1 p-6 prose prose-invert max-w-none prose-sm overflow-y-auto prose-h1:text-xl prose-h2:text-lg prose-p:text-sm prose-li:text-sm">
							{aiText ? (
								<ReactMarkdown>
									{aiText.includes('# 🚀 Tailored Resume')
										? aiText.split('# 🚀 Tailored Resume')[1]
										: aiText.includes('# 📊 Keyword Analysis')
											? '' // Hide analysis until resume starts
											: aiText}
								</ReactMarkdown>
							) : (
								<div className="flex flex-col gap-4 opacity-50 justify-center h-full items-center text-center">
									<div className="space-y-3 w-full max-w-md">
										<div className="h-2 w-full bg-white/10 rounded animate-pulse" />
										<div className="h-2 w-[80%] bg-white/10 rounded animate-pulse" />
										<div className="h-2 w-[90%] bg-white/10 rounded animate-pulse" />
									</div>
									<p className="text-xs italic">
										Click "Analyze Job" to start tailoring your resume...
									</p>
								</div>
							)}
							<div ref={bottomRef} />
						</ScrollArea>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default TailorStationPage;
