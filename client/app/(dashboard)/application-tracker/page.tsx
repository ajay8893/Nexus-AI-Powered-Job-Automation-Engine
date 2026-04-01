'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrackerBoard, Application, ApplicationStatus } from '@/components/applications/TrackerBoard';
import { TrackerList } from '@/components/applications/TrackerList';
import { JobDetailModal } from '@/components/applications/JobDetailModal';
import { LayoutGrid, List, Plus, RefreshCw, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ManualEntryModal } from '@/components/applications/ManualEntryModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ApplicationTrackerPage = () => {
	const [isMounted, setIsMounted] = useState(false);
	const [applications, setApplications] = useState<Application[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [view, setView] = useState<'board' | 'list'>('board');
	const [selectedApp, setSelectedApp] = useState<Application | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string>('All');
	const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

	const fetchApplications = async () => {
		try {
			setIsLoading(true);
			const res = await fetch('http://localhost:5001/api/applications', {
				credentials: 'include',
			});
			if (res.ok) {
				const data = await res.json();
				setApplications(data);
			}
		} catch (error) {
			console.error('Failed to fetch applications:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		setIsMounted(true);
		fetchApplications();
	}, []);

	if (!isMounted) {
		return null;
	}

	const handleStatusChange = async (id: string, status: ApplicationStatus) => {
		try {
			const res = await fetch(`http://localhost:5001/api/applications/${id}`, {
				method: 'PATCH',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status }),
			});

			if (res.ok) {
				const updatedApp = await res.json();
				setApplications((prev) =>
					prev.map((app) => (app._id === id ? updatedApp : app)),
				);
			}
		} catch (error) {
			console.error('Failed to update status:', error);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this application?')) return;

		try {
			const res = await fetch(`http://localhost:5001/api/applications/${id}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (res.ok) {
				setApplications((prev) => prev.filter((app) => app._id !== id));
			}
		} catch (error) {
			console.error('Failed to delete application:', error);
		}
	};

	const filteredApps = applications
		.filter((app) => {
			const matchesSearch =
				app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
			return matchesSearch && matchesStatus;
		})
		.sort((a, b) => {
			const dateA = new Date(a.updatedAt).getTime();
			const dateB = new Date(b.updatedAt).getTime();
			return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
		});

	return (
		<div className="flex flex-col h-auto lg:h-[calc(100vh-120px)] gap-6 w-full max-w-7xl mx-auto px-4 lg:px-0 overflow-hidden">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">
						Application Tracker
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage your job hunt across all stages in one place.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Button 
						variant="outline" 
						size="sm" 
						className="h-9 border-white/10 bg-white/5 hover:bg-white/10"
						onClick={fetchApplications}
						disabled={isLoading}
					>
						<RefreshCw className={`size-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
						Refresh
					</Button>
					<Button 
						className="h-9 shadow-lg shadow-primary/20"
						onClick={() => setIsManualEntryOpen(true)}
					>
						<Plus className="size-4 mr-2" />
						Manual Entry
					</Button>
				</div>
			</div>

			{/* Filters & View Toggle */}
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-black/20 border border-white/5 p-4 rounded-2xl">
				<div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
					<div className="relative w-full sm:w-64 group">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
						<Input
							placeholder="Search company or job title..."
							className="pl-10 bg-black/40 border-white/10 h-10 ring-offset-background group-focus-within:ring-1 group-focus-within:ring-primary/50 transition-all"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex w-full sm:w-auto gap-3">
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="flex-1 sm:w-[140px] h-10 bg-black/40 border-white/10">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent className="bg-background border-white/10">
								<SelectItem value="All">All Statuses</SelectItem>
								<SelectItem value="Draft">Draft</SelectItem>
								<SelectItem value="Applied">Applied</SelectItem>
								<SelectItem value="Interviewing">Interviewing</SelectItem>
								<SelectItem value="Offer">Offer</SelectItem>
								<SelectItem value="Rejected">Rejected</SelectItem>
							</SelectContent>
						</Select>

						<Select value={sortOrder} onValueChange={(val: any) => setSortOrder(val)}>
							<SelectTrigger className="flex-1 sm:w-[130px] h-10 bg-black/40 border-white/10">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent className="bg-background border-white/10">
								<SelectItem value="newest">Newest First</SelectItem>
								<SelectItem value="oldest">Oldest First</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex items-center gap-2 p-1 bg-black/40 rounded-xl border border-white/10 shrink-0 w-full md:w-auto">
					<Button
						variant={view === 'board' ? 'secondary' : 'ghost'}
						size="sm"
						className={`flex-1 md:flex-none h-8 px-4 font-semibold text-xs transition-all ${view === 'board' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-white/5 text-muted-foreground'}`}
						onClick={() => setView('board')}
					>
						<LayoutGrid className="size-3.5 mr-2" />
						Board
					</Button>
					<Button
						variant={view === 'list' ? 'secondary' : 'ghost'}
						size="sm"
						className={`flex-1 md:flex-none h-8 px-4 font-semibold text-xs transition-all ${view === 'list' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-white/5 text-muted-foreground'}`}
						onClick={() => setView('list')}
					>
						<List className="size-3.5 mr-2" />
						List
					</Button>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="flex-1 overflow-hidden">
				{isLoading ? (
					<div className="flex flex-col items-center justify-center h-full opacity-50 gap-4">
						<RefreshCw className="size-10 animate-spin text-primary" />
						<p className="text-sm font-medium tracking-widest uppercase">Loading your applications...</p>
					</div>
				) : (
					<div className="h-full">
						{view === 'board' ? (
							<TrackerBoard
								applications={filteredApps}
								onStatusChange={handleStatusChange}
								onDelete={handleDelete}
								onSelect={(app) => {
									setSelectedApp(app);
									setIsModalOpen(true);
								}}
							/>
						) : (
							<TrackerList
								applications={filteredApps}
								onStatusChange={handleStatusChange}
								onDelete={handleDelete}
								onSelect={(app) => {
									setSelectedApp(app);
									setIsModalOpen(true);
								}}
							/>
						)}
					</div>
				)}
			</div>

			<JobDetailModal 
				application={selectedApp} 
				open={isModalOpen} 
				onOpenChange={setIsModalOpen} 
			/>

			<ManualEntryModal 
				open={isManualEntryOpen} 
				onOpenChange={setIsManualEntryOpen} 
				onSuccess={fetchApplications}
			/>
		</div>
	);
};

export default ApplicationTrackerPage;
