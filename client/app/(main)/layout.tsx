import '@/app/globals.css';
import Footer from '@/components/Footer';
import NavBar from '@/components/Navbar';

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<NavBar />
			<main className="flex-1">{children}</main>
			<Footer />
		</>
	);
}
