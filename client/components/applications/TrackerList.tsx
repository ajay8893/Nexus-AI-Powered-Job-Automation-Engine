'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MoreVertical, ExternalLink, Trash2, Building2, MapPin, Calendar, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { Application, ApplicationStatus } from './TrackerBoard';

interface TrackerListProps {
	applications: Application[];
	onStatusChange: (id: string, status: ApplicationStatus) => void;
	onDelete: (id: string) => void;
	onSelect: (app: Application) => void;
}

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

export const TrackerList = ({ applications, onStatusChange, onDelete, onSelect }: TrackerListProps) => {
	const columns: ApplicationStatus[] = ['Draft', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

	return (
		<div className="flex flex-col gap-4 h-full bg-black/20 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
			{/* Table Header - Desktop Only */}
			<div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 border-b border-white/10 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
				<div className="col-span-4 translate-x-1">Job Details</div>
				<div className="col-span-2">Company</div>
				<div className="col-span-2">Status</div>
				<div className="col-span-2">Applied On</div>
				<div className="col-span-2 flex justify-end">Actions</div>
			</div>

			<ScrollArea className="flex-1 px-2">
				<div className="flex flex-col gap-2 md:gap-1 p-2">
					{applications.length > 0 ? (
						applications.map((app) => (
							<div 
								key={app._id} 
								className="flex flex-col md:grid md:grid-cols-12 gap-4 px-4 py-4 md:py-3 rounded-xl hover:bg-white/5 transition-all group items-start md:items-center border border-white/5 md:border-transparent hover:border-white/10 cursor-pointer bg-white/5 md:bg-transparent"
								onClick={() => onSelect(app)}
							>
								{/* Job Title & Location */}
								<div className="md:col-span-4 flex items-center gap-3 w-full">
									<div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
										<Briefcase className="size-5" />
									</div>
									<div className="flex flex-col gap-0.5">
										<span className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors text-wrap">
											{app.jobTitle}
										</span>
										<div className="flex items-center gap-1 text-[11px] text-muted-foreground">
											<MapPin className="size-3" />
											{app.location || 'Unknown'}
										</div>
									</div>
								</div>

								{/* Mobile Metadata Row */}
								<div className="flex md:hidden items-center justify-between w-full pt-2 border-t border-white/5 mt-2">
									<div className="flex flex-col gap-1">
										<div className="flex items-center gap-2 text-xs text-foreground/80">
											<Building2 className="size-3.5 text-muted-foreground" />
											{app.companyName}
										</div>
										<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
											<Calendar className="size-3" />
											{app.appliedAt 
												? format(new Date(app.appliedAt), 'MMM d, yyyy') 
												: `Saved ${format(new Date(app.updatedAt), 'MMM d')}`}
										</div>
									</div>
									<Badge variant="outline" className={`${getStatusColor(app.status)} px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold`}>
										{app.status}
									</Badge>
								</div>

								{/* Company - Desktop Only */}
								<div className="hidden md:flex md:col-span-2 items-center gap-2 text-sm text-foreground/80">
									<Building2 className="size-3.5 text-muted-foreground" />
									{app.companyName}
								</div>

								{/* Status Badge - Desktop Only */}
								<div className="hidden md:block md:col-span-2">
									<Badge variant="outline" className={`${getStatusColor(app.status)} px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold`}>
										{app.status}
									</Badge>
								</div>

								{/* Applied On - Desktop Only */}
								<div className="hidden md:flex md:col-span-2 items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
									<Calendar className="size-3.5" />
									{app.appliedAt 
										? format(new Date(app.appliedAt), 'MMM d, yyyy') 
										: `Saved ${format(new Date(app.updatedAt), 'MMM d')}`}
								</div>

								{/* Actions */}
								<div className="col-span-12 md:col-span-2 flex justify-end items-center gap-2 w-full md:w-auto mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/5 md:border-transparent">
									{app.jobUrl && (
										<Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
											<a href={app.jobUrl} target="_blank" rel="noopener noreferrer">
												<ExternalLink className="size-4" />
											</a>
										</Button>
									)}
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon" className="size-8">
												<MoreVertical className="size-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-48 bg-background border-white/10">
											{columns.filter(c => c !== app.status).map(c => (
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
							</div>
						))
					) : (
						<div className="flex flex-col items-center justify-center py-24 text-center opacity-30 border-2 border-dashed border-white/5 rounded-2xl m-4">
							<Briefcase className="size-12 mb-4" />
							<p className="text-sm italic font-medium">No applications found in your tracker</p>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
};
