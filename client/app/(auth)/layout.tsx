import NavBar from '@/components/Navbar';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="">
			<NavBar />
			<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
				{children}
			</div>
		</div>
	);
}
