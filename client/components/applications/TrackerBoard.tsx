'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MoreVertical, Building2, MapPin, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export type ApplicationStatus = 'Draft' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Application {
	_id: string;
	companyName: string;
	jobTitle: string;
	location?: string;
	status: ApplicationStatus;
	appliedAt?: string;
	jobUrl?: string;
	description?: string;
	tailoredDocumentId?: string;
	updatedAt: string;
}

interface TrackerBoardProps {
	applications: Application[];
	onStatusChange: (id: string, status: ApplicationStatus) => void;
	onDelete: (id: string) => void;
	onSelect: (app: Application) => void;
}

const COLUMNS: ApplicationStatus[] = ['Draft', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

const getStatusColor = (status: ApplicationStatus) => {
	switch (status) {
		case 'Draft': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
		case 'Applied': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
		case 'Interviewing': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
		case 'Offer': return 'bg-green-500/10 text-green-400 border-green-500/20';
		case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
		default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
	}
};

export const TrackerBoard = ({ applications, onStatusChange, onDelete, onSelect }: TrackerBoardProps) => {
	return (
		<div className="flex flex-col lg:flex-row gap-6 h-full overflow-x-auto pb-4 custom-scrollbar lg:snap-x">
			{COLUMNS.map((column) => {
				const columnApps = applications.filter((app) => app.status === column);

				return (
					<div key={column} className="shrink-0 w-full lg:w-80 flex flex-col gap-4 lg:snap-center">
						<div className="flex items-center justify-between px-2">
							<div className="flex items-center gap-2">
								<h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
									{column}
								</h3>
								<Badge variant="secondary" className="bg-white/5 text-[10px] h-5 min-w-[20px] flex items-center justify-center">
									{columnApps.length}
								</Badge>
							</div>
						</div>

						<ScrollArea className="flex-1 rounded-xl bg-black/20 border border-white/5 p-3">
							<div className="flex flex-col gap-3">
								{columnApps.length > 0 ? (
									columnApps.map((app) => (
										<Card 
											key={app._id} 
											className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors group cursor-pointer"
											onClick={() => onSelect(app)}
										>
											<CardHeader className="p-4 pb-2 space-y-0">
												<div className="flex items-start justify-between">
													<div className="space-y-1">
														<CardTitle className="text-sm font-bold leading-none group-hover:text-primary transition-colors">
															{app.jobTitle}
														</CardTitle>
														<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
															<Building2 className="size-3" />
															{app.companyName}
														</div>
													</div>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="icon" className="size-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
																<MoreVertical className="size-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end" className="w-48 bg-background border-white/10">
															{COLUMNS.filter(c => c !== column).map(c => (
																<DropdownMenuItem key={c} onClick={() => onStatusChange(app._id, c)}>
																	Move to {c}
																</DropdownMenuItem>
															))}
															<DropdownMenuItem 
																className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
																onClick={() => onDelete(app._id)}
															>
																<Trash2 className="size-4 mr-2" />
																Delete Application
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</CardHeader>
											<CardContent className="p-4 pt-0 space-y-3">
												{app.location && (
													<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
														<MapPin className="size-3" />
														{app.location}
													</div>
												)}
												
												<div className="flex items-center justify-between pt-2 border-t border-white/5">
													<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
														<Calendar className="size-3" />
														{app.appliedAt 
															? format(new Date(app.appliedAt), 'MMM d, yyyy') 
															: `Saved ${format(new Date(app.updatedAt), 'MMM d')}`}
													</div>
													{app.jobUrl && (
														<a 
															href={app.jobUrl} 
															target="_blank" 
															rel="noopener noreferrer"
															className="text-primary hover:text-primary/80 transition-colors"
														>
															<ExternalLink className="size-3" />
														</a>
													)}
												</div>
											</CardContent>
										</Card>
									))
								) : (
									<div className="flex flex-col items-center justify-center py-12 px-6 text-center opacity-30 border-2 border-dashed border-white/10 rounded-lg">
										<p className="text-xs italic">No applications here</p>
									</div>
								)}
							</div>
						</ScrollArea>
					</div>
				);
			})}
		</div>
	);
};
