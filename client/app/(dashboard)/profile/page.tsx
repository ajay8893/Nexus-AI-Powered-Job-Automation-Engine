'use client';

import { useState, useEffect } from 'react';
import { useSession, authClient } from '@/lib/auth-client';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import api from '@/lib/axios';
import { UploadDropzone } from '@uploadthing/react';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
	CloudUpload,
	FileText,
	Loader2,
	Trash2,
	Mail,
	User,
	Settings2,
	Star,
	ShieldCheck,
	Crown,
	Upload,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
	// === User Profile State ===
	const { data: session, isPending } = useSession();
	const [name, setName] = useState('');
	const [isUpdating, setIsUpdating] = useState(false);

	// === Resume Manager State ===
	const [resumes, setResumes] = useState<any[]>([]);
	const [isLoadingResumes, setIsLoadingResumes] = useState(false);
	const [settingMasterId, setSettingMasterId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	// === Delete Confirmation State ===
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [resumeToDelete, setResumeToDelete] = useState<any>(null);

	// === Effects ===
	useEffect(() => {
		if (session?.user?.name) {
			setName(session.user.name);
		}
	}, [session]);

	useEffect(() => {
		if (session?.user?.id) {
			fetchResumes();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session?.user?.id]);

	// === Handlers: Profile ===
	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || name === session?.user?.name) return;

		setIsUpdating(true);
		try {
			await authClient.updateUser({ name: name.trim() });
			toast.success('Profile updated successfully!');
		} catch (error) {
			console.error('Failed to update profile', error);
			toast.error('Failed to update profile. Please try again.');
		} finally {
			setIsUpdating(false);
		}
	};

	// === Handlers: Resumes ===
	const fetchResumes = async () => {
		if (!session?.user?.id) return;
		setIsLoadingResumes(true);
		try {
			const res = await api.get(`/api/resume/user/${session.user.id}`);
			setResumes(res.data.resumes);
		} catch (error) {
			toast.error('Failed to load resumes');
		} finally {
			setIsLoadingResumes(false);
		}
	};

	const handleSetMaster = async (resumeId: string) => {
		setSettingMasterId(resumeId);
		try {
			await api.post(`/api/resume/master`, {
				userId: session?.user?.id,
				resumeId,
			});
			toast.success('Master resume updated! The AI will now use this resume for tailoring.');
			fetchResumes();
		} catch (error) {
			toast.error('Failed to update master resume');
		} finally {
			setSettingMasterId(null);
		}
	};

	const openDeleteDialog = (file: any) => {
		setResumeToDelete(file);
		setDeleteDialogOpen(true);
	};

	const handleDelete = async () => {
		if (!resumeToDelete) return;
		const resumeId = resumeToDelete._id;
		const wasMaster = resumeToDelete.isMaster;

		setDeleteDialogOpen(false);
		setDeletingId(resumeId);

		try {
			await api.delete(`/api/resume/${resumeId}`);
			toast.success(
				wasMaster && resumes.length > 1
					? 'Resume deleted. The next most recent resume has been auto-promoted to master.'
					: 'Resume deleted successfully'
			);
			fetchResumes();
		} catch (error) {
			toast.error('Failed to delete resume');
		} finally {
			setDeletingId(null);
			setResumeToDelete(null);
		}
	};

	if (isPending) {
		return (
			<div className="flex h-[calc(100vh-120px)] items-center justify-center">
				<Loader2 className="size-8 animate-spin text-primary" />
			</div>
		);
	}

	const user = session?.user;
	const masterResume = resumes.find((r) => r.isMaster);
	const otherResumes = resumes.filter((r) => !r.isMaster);

	return (
		<div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-4 lg:px-0 pb-12">
			{/* Page Header */}
			<div className="space-y-1">
				<h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">
					Settings & Preferences
				</h1>
				<p className="text-sm text-muted-foreground">
					Manage your account settings, personal info, and master resumes.
				</p>
			</div>

			<Tabs defaultValue="resume" className="w-full">
				<TabsList className="bg-black/20 border border-white/5 mb-6">
					<TabsTrigger value="resume" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
						<FileText className="size-4 mr-2" /> Resume Manager
						{resumes.length > 0 && (
							<Badge variant="secondary" className="ml-2 bg-white/10 text-[10px] px-1.5 py-0 min-w-[18px] h-[18px] flex items-center justify-center">
								{resumes.length}
							</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
						<Settings2 className="size-4 mr-2" /> Account Details
					</TabsTrigger>
				</TabsList>

				{/* === RESUME MANAGER TAB === */}
				<TabsContent value="resume" className="space-y-6 outline-none">

					{/* Active Master Resume Highlight */}
					{masterResume && (
						<Card className="border-primary/20 bg-primary/5 backdrop-blur-2xl overflow-hidden relative">
							<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
							<CardContent className="p-5">
								<div className="flex items-center gap-4">
									<div className="p-3 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
										<Crown size={22} />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-0.5">
											<p className="text-sm font-bold text-foreground truncate">
												{masterResume.fileName}
											</p>
											<span className="text-[9px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase font-bold tracking-wider shrink-0">
												Active Master
											</span>
										</div>
										<p className="text-xs text-muted-foreground">
											This is the resume the AI uses for all tailoring operations. Uploaded {new Date(masterResume.createdAt).toLocaleDateString()}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<ShieldCheck size={18} className="text-primary" />
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Upload Zone */}
					<Card className="border-gray-50/10 bg-white/5 backdrop-blur-2xl">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="text-xl flex items-center gap-2">
										<Upload size={20} className="text-primary" />
										Upload Resumes
									</CardTitle>
									<CardDescription className="mt-1">
										Upload one or more resumes (up to 5 at a time). Your first upload automatically becomes the Master Resume.
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<UploadDropzone<OurFileRouter, 'resumeUploader'>
								endpoint="resumeUploader"
								onClientUploadComplete={() => {
									toast.success('Upload complete!');
									fetchResumes();
								}}
								onUploadError={(error: Error) => {
									toast.error(error.message);
								}}
								appearance={{
									container: 'border-dashed border-2 border-primary/30 bg-primary/5 rounded-2xl py-10 transition-all hover:bg-primary/10 hover:border-primary/50 cursor-pointer',
									uploadIcon: 'text-primary',
									label: 'text-foreground font-semibold',
									allowedContent: 'text-muted-foreground text-xs mt-1',
									button: 'bg-primary hover:bg-primary/90 h-10 px-6 rounded-xl shadow-lg shadow-primary/20 text-primary-foreground font-semibold text-sm mt-2',
								}}
								content={{
									label() {
										return 'Drag & drop your resume PDFs here';
									},
									allowedContent() {
										return 'PDF files up to 4MB · Max 5 files at once';
									},
								}}
							/>
						</CardContent>
					</Card>

					{/* Version History */}
					<Card className="border-gray-50/10 bg-white/5 backdrop-blur-2xl">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="text-xl">Version History</CardTitle>
									<CardDescription>
										Manage your uploaded resumes. Click <strong>"Set as Master"</strong> to choose which resume the AI uses for tailoring.
									</CardDescription>
								</div>
								{resumes.length > 0 && (
									<Badge variant="outline" className="text-xs border-white/10 text-muted-foreground shrink-0">
										{resumes.length} resume{resumes.length !== 1 ? 's' : ''}
									</Badge>
								)}
							</div>
						</CardHeader>
						<CardContent>
							{isLoadingResumes ? (
								<div className="flex justify-center py-10">
									<Loader2 className="size-8 animate-spin text-primary" />
								</div>
							) : resumes.length > 0 ? (
								<div className="grid gap-3">
									{resumes.map((file) => (
										<div
											key={file._id}
											className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-xl border transition-all ${
												file.isMaster
													? 'bg-primary/10 border-primary/30 shadow-sm shadow-primary/5'
													: 'bg-black/20 border-white/5 hover:border-white/20'
											} ${deletingId === file._id ? 'opacity-50 pointer-events-none' : ''}`}
										>
											<div className="flex gap-4 items-center">
												<div className={`p-3 rounded-lg flex items-center justify-center transition-all ${
													file.isMaster 
														? 'bg-primary text-primary-foreground shadow-md' 
														: 'bg-white/5 text-muted-foreground'
												}`}>
													{file.isMaster ? <Star size={20} fill="currentColor" /> : <FileText size={20} />}
												</div>
												<div>
													<div className="flex flex-wrap items-center gap-2 mb-0.5">
														<p className="text-sm font-semibold text-foreground">{file.fileName}</p>
														{file.isMaster && (
															<span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
																Active Master
															</span>
														)}
													</div>
													<p className="text-xs text-muted-foreground flex items-center gap-1">
														Uploaded {new Date(file.createdAt).toLocaleDateString()}
													</p>
												</div>
											</div>

											<div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-white/5">
												{!file.isMaster && (
													<Button
														variant="outline"
														size="sm"
														className="text-xs h-9 gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
														onClick={() => handleSetMaster(file._id)}
														disabled={settingMasterId === file._id}
													>
														{settingMasterId === file._id ? (
															<>
																<Loader2 size={14} className="animate-spin" />
																Setting...
															</>
														) : (
															<>
																<Star size={14} /> Set as Master
															</>
														)}
													</Button>
												)}
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
													onClick={() => openDeleteDialog(file)}
													disabled={deletingId === file._id}
												>
													{deletingId === file._id ? (
														<Loader2 size={16} className="animate-spin" />
													) : (
														<Trash2 size={16} />
													)}
												</Button>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="py-12 flex flex-col items-center justify-center text-center opacity-50 border-2 border-dashed border-white/5 rounded-xl">
									<FileText className="size-10 mb-2 opacity-50" />
									<p className="text-sm italic">No resumes uploaded yet.</p>
									<p className="text-xs text-muted-foreground mt-1">Upload your first resume above — it will automatically become your Master Resume.</p>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* === ACCOUNT DETAILS TAB === */}
				<TabsContent value="account" className="space-y-6 outline-none">
					<div className="grid gap-6 md:grid-cols-12">
						{/* Avatar Card */}
						<Card className="md:col-span-4 border-gray-50/10 bg-white/5 backdrop-blur-2xl h-fit">
							<CardHeader className="flex flex-col items-center justify-center text-center pb-6">
								<Avatar className="h-24 w-24 rounded-full border-4 border-background shadow-xl mb-3">
									{user?.image ? (
										<AvatarImage src={user.image} alt={user.name} />
									) : (
										<AvatarFallback className="text-2xl font-bold rounded-full bg-primary text-primary-foreground">
											{user?.name?.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									)}
								</Avatar>
								<CardTitle>{user?.name}</CardTitle>
								<CardDescription className="flex items-center gap-1.5 mt-1">
									<Mail className="size-3" />
									{user?.email}
								</CardDescription>
							</CardHeader>
						</Card>

						{/* Update Form Card */}
						<Card className="md:col-span-8 border-gray-50/10 bg-white/5 backdrop-blur-2xl">
							<CardHeader>
								<CardTitle className="text-xl">Personal Information</CardTitle>
								<CardDescription>
									Update your display name and view your account details.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleUpdateProfile} className="space-y-6">
									<div className="space-y-4">
										<div className="space-y-2">
											<label className="text-xs uppercase font-bold text-muted-foreground px-1 flex items-center gap-1.5">
												<User className="size-3" /> Display Name
											</label>
											<Input
												placeholder="Your full name"
												value={name}
												onChange={(e) => setName(e.target.value)}
												className="bg-black/40 border-white/10"
											/>
										</div>

										<div className="space-y-2">
											<label className="text-xs uppercase font-bold text-muted-foreground px-1 flex items-center gap-1.5">
												<Mail className="size-3" /> Email Address
											</label>
											<Input
												value={user?.email || ''}
												disabled
												className="bg-black/40 border-white/10 opacity-70 cursor-not-allowed text-muted-foreground"
											/>
											<p className="text-[10px] text-muted-foreground px-1 leading-relaxed">
												Your email address is linked to your authentication provider and cannot be changed here.
											</p>
										</div>
									</div>

									<div className="flex justify-end pt-4 border-t border-white/5">
										<Button
											type="submit"
											disabled={isUpdating || !name.trim() || name === session?.user?.name}
											className="bg-primary text-primary-foreground min-w-[120px]"
										>
											{isUpdating ? (
												<>
													<Loader2 className="size-4 mr-2 animate-spin" /> Saving...
												</>
											) : (
												'Save Changes'
											)}
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent className="bg-background border-white/10">
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Resume</AlertDialogTitle>
						<AlertDialogDescription className="space-y-2">
							<span className="block">
								Are you sure you want to delete <strong className="text-foreground">{resumeToDelete?.fileName}</strong>?
							</span>
							{resumeToDelete?.isMaster && resumes.length > 1 && (
								<span className="block text-yellow-500 text-xs font-medium">
									⚠️ This is your active Master Resume. The next most recent resume will be auto-promoted to master.
								</span>
							)}
							{resumeToDelete?.isMaster && resumes.length === 1 && (
								<span className="block text-destructive text-xs font-medium">
									⚠️ This is your only resume. Deleting it means the AI won&apos;t have a resume to tailor from.
								</span>
							)}
							<span className="block text-xs text-muted-foreground">
								This action cannot be undone. The file will be permanently removed from storage.
							</span>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-white/10">Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete Resume
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
