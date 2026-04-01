'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
    Sheet, 
    SheetContent, 
    SheetDescription, 
    SheetHeader, 
    SheetTitle 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { JobApplicationInput, jobApplicationSchema } from '@/lib/validations/application';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';

interface ManualEntryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export const ManualEntryModal = ({ open, onOpenChange, onSuccess }: ManualEntryModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<JobApplicationInput>({
        resolver: zodResolver(jobApplicationSchema),
        defaultValues: {
            status: 'Draft',
        }
    });

    const statusValue = watch('status');

    const onSubmit = async (data: JobApplicationInput) => {
        try {
            const res = await fetch('http://localhost:5001/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (res.ok) {
                toast.success('Application added successfully');
                reset();
                onSuccess();
                onOpenChange(false);
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || 'Failed to add application');
            }
        } catch (error) {
            console.error('Error adding application:', error);
            toast.error('Something went wrong');
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl w-full bg-slate-900 border-l border-white/10 p-0 overflow-hidden flex flex-col">
                <SheetHeader className="p-6 bg-white/5 border-b border-white/5">
                    <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                        <Plus className="size-6 text-primary" />
                        Manual Entry
                    </SheetTitle>
                    <SheetDescription className="text-slate-400">
                        Add a job application manually to your tracker.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Company Name *</Label>
                            <Input 
                                {...register('companyName')} 
                                placeholder="e.g. Google, Meta"
                                className="bg-white/5 border-white/10 focus:ring-primary"
                            />
                            {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Job Title *</Label>
                            <Input 
                                {...register('jobTitle')} 
                                placeholder="e.g. Senior Frontend Engineer"
                                className="bg-white/5 border-white/10 focus:ring-primary"
                            />
                            {errors.jobTitle && <p className="text-xs text-red-500">{errors.jobTitle.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Location</Label>
                            <Input 
                                {...register('location')} 
                                placeholder="e.g. Remote, San Francisco"
                                className="bg-white/5 border-white/10 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Salary Range</Label>
                            <Input 
                                {...register('salary')} 
                                placeholder="e.g. $120k - $150k"
                                className="bg-white/5 border-white/10 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Job URL</Label>
                        <Input 
                            {...register('jobUrl')} 
                            placeholder="https://linkedin.com/jobs/..."
                            className="bg-white/5 border-white/10 focus:ring-primary"
                        />
                        {errors.jobUrl && <p className="text-xs text-red-500">{errors.jobUrl.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Status</Label>
                        <Select 
                            value={statusValue} 
                            onValueChange={(val: string) => setValue('status', val as any)}
                        >
                            <SelectTrigger className="bg-white/5 border-white/10">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Applied">Applied</SelectItem>
                                <SelectItem value="Interviewing">Interviewing</SelectItem>
                                <SelectItem value="Offer">Offer</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Job Description</Label>
                        <Textarea 
                            {...register('description')} 
                            placeholder="Paste the job description here..."
                            className="bg-white/5 border-white/10 focus:ring-primary min-h-[200px]"
                        />
                    </div>
                </form>

                <div className="p-6 bg-white/5 border-t border-white/5 flex gap-3">
                    <Button 
                        variant="outline" 
                        className="flex-1 border-white/10 hover:bg-white/5 text-white" 
                        onClick={() => onOpenChange(false)}
                        type="button"
                    >
                        Cancel
                    </Button>
                    <Button 
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" 
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Add Application
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};
