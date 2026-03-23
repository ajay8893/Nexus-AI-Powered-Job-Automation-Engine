import { Button } from '@/components/ui/button';
import { CloudUpload, FileText, ShieldCheck, Trash2 } from 'lucide-react';

const Profile = () => {
	return (
		<div className="flex flex-col gap-8 w-full max-w-5xl pb-10 mx-auto">
			{/* Header */}
			<div className="flex flex-col gap-1">
				<h1 className="text-3xl font-bold tracking-tight">AI Profile</h1>
				<p className="text-muted-foreground">
					Your Master Resume is the brain of Nexus. AI uses it to generate all
					tailored applications.
				</p>
			</div>

			{/* Master Resume Upload Zone */}
			<div className="space-y-4">
				<div className="flex items-center justify-between px-1">
					<h3 className="text-lg font-semibold flex items-center gap-2">
						<ShieldCheck className="text-digital-blue-500 size-5" />
						Master Resume
					</h3>
					<span className="text-xs text-digital-blue-500 bg-digital-blue-500/10 px-2 py-1 rounded-full font-medium">
						Status: Ready
					</span>
				</div>

				<div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-3xl p-12 bg-white/5 hover:bg-digital-blue-500/5 hover:border-digital-blue-500/50 transition-all cursor-pointer">
					<div className="bg-digital-blue-500/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
						<CloudUpload size={40} className="text-digital-blue-500" />
					</div>
					<h3 className="text-xl font-semibold">Click or drag to upload</h3>
					<p className="text-muted-foreground text-sm mt-1">
						PDF, DOCX (Max. 10MB)
					</p>

					<Button className="mt-8 bg-digital-blue-600 hover:bg-digital-blue-700 text-white px-8 h-12 shadow-lg shadow-digital-blue-500/20">
						Select Master File
					</Button>
				</div>
			</div>

			{/* Upload History / Current Files */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold px-1">Version History</h3>

				<div className="grid gap-3">
					{[
						{
							name: 'Ajay_M_Fullstack_2026.pdf',
							date: 'Mar 15, 2026',
							size: '1.2 MB',
							active: true,
						},
						{
							name: 'Resume_Old_V2.pdf',
							date: 'Jan 10, 2026',
							size: '850 KB',
							active: false,
						},
					].map((file, i) => (
						<div
							key={i}
							className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
								file.active
									? 'bg-digital-blue-500/5 border-digital-blue-500/30'
									: 'bg-muted/30 border-transparent hover:border-muted-foreground/20'
							}`}
						>
							<div className="flex gap-4 items-center">
								<div
									className={`p-2 rounded-lg ${file.active ? 'bg-digital-blue-500 text-white' : 'bg-muted text-muted-foreground'}`}
								>
									<FileText size={20} />
								</div>
								<div>
									<div className="flex items-center gap-2">
										<p className="text-sm font-medium">{file.name}</p>
										{file.active && (
											<span className="text-[10px] bg-digital-blue-500 text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">
												Active
											</span>
										)}
									</div>
									<p className="text-xs text-muted-foreground">
										Uploaded {file.date} • {file.size}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-2">
								{!file.active && (
									<Button variant="ghost" size="sm" className="text-xs h-8">
										Set as Master
									</Button>
								)}
								<Button
									variant="ghost"
									size="icon"
									className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
								>
									<Trash2 size={18} />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Profile;
