'use client';

import { 
    Sheet, 
    SheetContent, 
    SheetDescription, 
    SheetHeader, 
    SheetTitle 
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    Building2, 
    MapPin, 
    Calendar, 
    ExternalLink, 
    FileDown, 
    Briefcase,
    Globe,
    FileText,
    Share2
} from 'lucide-react';
import { format } from 'date-fns';
import { Application, ApplicationStatus } from './TrackerBoard';

interface JobDetailModalProps {
    application: Application | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
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

export const JobDetailModal = ({ application, open, onOpenChange }: JobDetailModalProps) => {
    if (!application) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl w-full bg-slate-900 border-l border-white/10 p-0 overflow-hidden flex flex-col">
                <SheetHeader className="p-6 bg-white/5 border-b border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className={`${getStatusColor(application.status)} px-3 py-1 text-[10px] uppercase font-bold tracking-widest`}>
                            {application.status}
                        </Badge>
                        <div className="flex items-center gap-2">
                             <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                                <Share2 className="size-4" />
                            </Button>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <SheetTitle className="text-2xl font-bold leading-tight bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
                            {application.jobTitle}
                        </SheetTitle>
                        <div className="flex items-center gap-2 text-primary font-medium">
                            <Building2 className="size-4" />
                            {application.companyName}
                        </div>
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-8">
                        {/* Meta Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                                <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                                    <MapPin className="size-3" />
                                    Location
                                </div>
                                <div className="text-sm font-medium">{application.location || 'Remote / Unspecified'}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                                <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                                    <Calendar className="size-3" />
                                    Applied On
                                </div>
                                <div className="text-sm font-medium">
                                    {application.appliedAt ? format(new Date(application.appliedAt), 'PPP') : 'Not applied yet'}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-1 gap-3">
                            {application.jobUrl && (
                                <Button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white justify-between h-12" asChild>
                                    <a href={application.jobUrl} target="_blank" rel="noopener noreferrer">
                                        <div className="flex items-center gap-2">
                                            <Globe className="size-4 text-primary" />
                                            View Original Listing
                                        </div>
                                        <ExternalLink className="size-4 opacity-50" />
                                    </a>
                                </Button>
                            )}
                            
                            {/* IF we have a tailoredDocumentId, show the download button */}
                            {application.tailoredDocumentId && (
                                <Button 
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white justify-between h-12 shadow-lg shadow-indigo-600/20"
                                    onClick={() => window.open(`http://localhost:5001/api/tailor/download/${application.tailoredDocumentId}`, '_blank')}
                                >
                                    <div className="flex items-center gap-2">
                                        <FileDown className="size-4" />
                                        Download Tailored Resume
                                    </div>
                                    <FileText className="size-4 opacity-50" />
                                </Button>
                            )}
                        </div>

                        <Separator className="bg-white/5" />

                        {/* Description (If available) */}
                        {application.description && (
                            <div className="space-y-3">
                                <h4 className="text-xs uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Briefcase className="size-3.5" />
                                    Job Description
                                </h4>
                                <div className="text-sm text-foreground/80 leading-relaxed bg-white/5 rounded-xl p-4 border border-white/10 italic">
                                    {application.description.length > 500 
                                        ? application.description.substring(0, 500) + '...' 
                                        : application.description}
                                </div>
                            </div>
                        )}

                        {/* Recent Activity (Placeholder for future) */}
                        <div className="space-y-3 pb-8">
                             <h4 className="text-xs uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                                Activity History
                            </h4>
                            <div className="text-[11px] text-muted-foreground italic flex items-center gap-2">
                                <div className="size-1.5 rounded-full bg-primary" />
                                Application created on {format(new Date(application.updatedAt), 'PPP')}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-6 bg-white/5 border-t border-white/5 flex gap-3">
                    <Button variant="outline" className="flex-1 border-white/10 bg-black/40 hover:bg-white/5" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};
