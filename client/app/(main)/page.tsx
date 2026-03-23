import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Testimonials from '@/components/Testimonials';
import TryOut from '@/components/TryOut';

const Home = () => {
	return (
		<>
			<Hero />
			<div className="max-w-7xl mx-auto px-4 py-10 md:py-20 md:px-8 space-y-16 md:space-y-24 ">
				<Features />
				<Testimonials />
				<TryOut />
			</div>
		</>
	);
};

export default Home;
