'use client';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import api from '@/lib/axios';
import { UploadButton } from '@uploadthing/react';
import { CloudUpload, FileText, Loader2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Profile = () => {
	const { data: session } = authClient.useSession();
	const [resumes, setResumes] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	// fetch resumes
	const fetchResumes = async () => {
		if (!session?.user?.id) return;
		setIsLoading(true);
		try {
			const res = await api.get(`/api/resume/user/${session.user.id}`);
			setResumes(res.data.resumes);
		} catch (error) {
			toast.error('Failed to load resumes');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchResumes();
	}, [session?.user?.id]);

	const handleSetMaster = async (resumeId: string) => {
		try {
			await api.post(`/api/resume/master`, {
				userId: session?.user?.id,
				resumeId,
			});
			toast.success('Master resume updated successfully');
			fetchResumes();
		} catch (error) {
			toast.error('Failed to update master resume');
		}
	};

	const handleDelete = async (resumeId: string) => {
		try {
			await api.delete(`/api/resume/${resumeId}`);
			toast.success('Resume deleted successfully');
			fetchResumes();
		} catch (error) {
			toast.error('Failed to delete resume');
		}
	};
	return (
		<div className="flex flex-col gap-8 w-full max-w-5xl pb-10 mx-auto">
			{/* Header */}
			<div className="flex flex-col gap-1">
				<h1 className="text-3xl font-bold tracking-tight">
					{session?.user?.name}'s Profile
				</h1>
				<p className="text-muted-foreground">
					Your Master Resume is the brain of Nexus. AI uses it to generate all
					tailored applications.
				</p>
			</div>

			{/* Master Resume Upload Zone */}
			<div className="space-y-4">
				<div className="flex flex-col items-center py-12 sm:py-25 border-dashed border-2 border-digital-blue-500/50 bg-digital-blue-500/10 rounded-2xl w-full gap-4 transition-all">
					<UploadButton<OurFileRouter, 'resumeUploader'>
						endpoint="resumeUploader"
						onClientUploadComplete={() => {
							toast.success('Upload complete!');
							fetchResumes();
						}}
						onUploadError={(error) => {
							toast.error(error.message);
						}}
						content={{
							button({ ready }) {
								if (ready)
									return (
										<div className="flex items-center gap-2">
											<CloudUpload size={20} /> Select Master File
										</div>
									);
								return 'Loading...';
							},
						}}
						appearance={{
							button:
								'bg-digital-blue-600 hover:bg-digital-blue-700 h-12 px-8 rounded-xl shadow-lg shadow-digital-blue-500/20 w-full md:w-auto',
							allowedContent: 'text-muted-foreground text-xs mt-2',
						}}
					/>
				</div>
			</div>

			{/* Upload History / Current Files */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold px-1">Version History</h3>
				{isLoading ? (
					<div className="flex justify-center py-10">
						<Loader2 className="animate-spin text-digital-blue-500" />
					</div>
				) : (
					<div className="grid gap-3">
						{resumes.map((file) => (
							<div
								key={file._id}
								className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
									file.isMaster
										? 'bg-digital-blue-500/5 border-digital-blue-500/30'
										: 'bg-muted/30 border-transparent hover:border-muted-foreground/20'
								}`}
							>
								<div className="flex gap-4 items-center">
									<div
										className={`p-2 rounded-lg ${file.isMaster ? 'bg-digital-blue-500 text-white' : 'bg-muted text-muted-foreground'}`}
									>
										<FileText size={20} />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<p className="text-sm font-medium">{file.fileName}</p>
											{file.isMaster && (
												<span className="text-[10px] bg-digital-blue-500 text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">
													Active
												</span>
											)}
										</div>
										<p className="text-xs text-muted-foreground">
											Uploaded {new Date(file.createdAt).toLocaleDateString()}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									{!file.isMaster && (
										<Button
											variant="ghost"
											size="sm"
											className="text-xs h-8"
											onClick={() => handleSetMaster(file._id)}
										>
											Set as Master
										</Button>
									)}
									<Button
										variant="ghost"
										size="icon"
										className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
										onClick={() => handleDelete(file._id)}
									>
										<Trash2 size={18} />
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Profile;
