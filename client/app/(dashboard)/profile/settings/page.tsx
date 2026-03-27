'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { Camera, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const SettingsPage = () => {
	const { data: session } = authClient.useSession();
	const [isUpdating, setIsUpdating] = useState(false);

	const [name, setName] = useState(session?.user?.name || '');
	const [email, setEmail] = useState(session?.user?.email || '');

	const handleUpdateProfileName = async () => {
		setIsUpdating(true);
		await authClient.updateUser({
			name,
		});
		setIsUpdating(false);
	};

	const user = session?.user;

	return (
		<div className="w-full max-w-4xl mx-auto flex flex-col gap-8 px-4 py-6 mb-20">
			<div className="flex flex-col gap-1 text-center sm:text-left">
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
					Account Settings
				</h1>
				<p className="text-xs text-muted-foreground">
					Update your personal information and preferences
				</p>
			</div>
			{/* Profile Card */}
			<div className="flex flex-col gap-6 border p-4 rounded-xl sm:p-8 bg-card/50 backdrop-blur-sm">
				{/* Avatar Upload */}
				{/* Avatar Upload */}
				<div className="flex flex-col gap-4 items-center justify-center py-4">
					<div className="relative group">
						<Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-digital-blue-500/20">
							{user?.image ? (
								<AvatarImage src={user.image} alt={user.name || 'User'} />
							) : (
								<AvatarFallback className="text-5xl">
									{user?.name?.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							)}
						</Avatar>
						<button className="absolute bottom-0 right-0 p-2 bg-digital-blue-600 text-white rounded-full shadow-lg hover:bg-digital-blue-700 transition-colors">
							<Camera size={16} />
						</button>
					</div>
					<div className="text-center">
						<h2 className="text-xl font-semibold">{user?.name}</h2>
						<p className="text-sm text-muted-foreground">{user?.email}</p>
					</div>
				</div>
				{/* Name and Email */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							type="text"
							className="bg-muted/50 border-white/10"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							value={email}
							type="email"
							className="bg-muted/50 border-white/10"
							disabled
						/>
					</div>
				</div>
			</div>
			{/* Security Settings */}
			<div className="space-y-6">
				<div className="flex flex-col gap-1 px-1">
					<h1 className="text-xl font-bold">Security Settings</h1>
					<p className="text-xs text-muted-foreground">
						secure your account with password and multi-factor authentication
					</p>
				</div>

				<div className="grid gap-4 px-0 sm:px-1">
					<div className="flex flex-col sm:flex-row border p-4 justify-between items-start sm:items-center rounded-xl gap-4 bg-card/50 backdrop-blur-sm">
						<div className="flex gap-4 items-center">
							<div className="p-2 bg-digital-blue-500/10 rounded-lg text-digital-blue-500">
								<Lock size={20} />
							</div>
							<div className="flex flex-col">
								<h3 className="text-sm font-medium">Password</h3>
								<p className="text-xs text-muted-foreground">
									last changed 2 weeks ago
								</p>
							</div>
						</div>
						<Button
							variant="outline"
							className="text-xs w-full sm:w-auto text-digital-blue-600 hover:text-digital-blue-700 border-digital-blue-600/20"
						>
							Change Password
						</Button>
					</div>
					<div className="flex flex-col sm:flex-row border p-4 justify-between items-start sm:items-center rounded-xl gap-4 bg-card/50 backdrop-blur-sm	">
						<div className="flex gap-4 items-center">
							<div className="p-2 bg-digital-blue-500/10 rounded-lg text-digital-blue-500">
								<ShieldCheck size={20} />
							</div>
							<div className="flex flex-col">
								<h3 className="text-sm font-medium">
									Two-Factor Authentication
								</h3>
								<p className="text-xs text-muted-foreground">
									Add an extra layer of security to your account
								</p>
							</div>
						</div>
						<Button
							variant="outline"
							className="text-xs w-full sm:w-auto text-digital-blue-600 hover:text-digital-blue-700 border-digital-blue-600/20"
						>
							Enable
						</Button>
					</div>
				</div>
			</div>
			<div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
				<Button
					variant="ghost"
					className="w-full sm:w-auto h-12 px-8 text-muted-foreground"
				>
					Cancel
				</Button>
				<Button
					className="w-full sm:w-auto h-12 px-8 bg-digital-blue-600 hover:bg-digital-blue-700 text-white shadow-lg shadow-digital-blue-500/20"
					onClick={handleUpdateProfileName}
					disabled={isUpdating}
				>
					{isUpdating ? 'Saving...' : 'Save Changes'}
				</Button>
			</div>
		</div>
	);
};

export default SettingsPage;
