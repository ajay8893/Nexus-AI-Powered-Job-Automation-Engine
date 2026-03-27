'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/lib/auth-client';
import { SignInInput, signInSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const GoogleIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		aria-hidden="true"
		focusable="false"
		data-prefix="fab"
		data-icon="google"
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 488 512"
	>
		<path
			fill="currentColor"
			d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
		></path>
	</svg>
);

const AppleIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill="currentColor"
		viewBox="0 0 384 512"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-19-81.6-19C71 142.1 0 203.8 0 299.1c0 58.8 18 114.6 51.4 161.8 16 23.1 39.1 54 75.8 52.7 34.8-1.4 44.6-21.9 85.1-21.9 41.1 0 52 21.9 88.2 21.2 38-.8 57-28.1 73.1-51.4 18.8-27.1 26.3-53.4 26.6-54.7-1.3-.5-67.6-25.2-67.6-102.3l-.1-.4zM240.3 57.2c21.2-26.1 35.4-62.4 31.4-98.1-30.9 1.2-68.5 20.6-90.7 46.7-19.9 23.2-34.6 57.9-29.9 92.5 34.5 2.7 68.2-15 89.2-41.1z" />
	</svg>
);

const SignIn = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInInput>({
		resolver: zodResolver(signInSchema),
	});
	const router = useRouter();

	const onSubmit = async (data: SignInInput) => {
		const { email, password } = data;
		const { data: res, error } = await signIn.email({
			email,
			password,
			callbackURL: '/dashboard',
		});

		if (error) {
			toast.error(error.message || 'Something went wrong');
			return;
		}

		toast.success('Welcome back to Nexus');
		router.push('/dashboard');
	};
	return (
		<div className="flex flex-col md:flex-row h-[calc(100vh-20vh)] w-full max-w-4xl lg:mx-w-5xl overflow-hidden shadow-2xl rounded-2xl dark:border dark:border-white/10">
			{/* left */}
			<div className="hidden md:flex flex-col bg-digital-blue-600 w-full md:w-1/2 p-10 space-y-10">
				<div className="flex items-center gap-2">
					<div className="border rounded-lg bg-digital-blue-500 p-1 text-white">
						<Link href="/">
							<Sparkles strokeWidth={1} size={20} />
						</Link>
					</div>
					<Link className="text-xl font-bold tracking-wide text-white" href="/">
						Nexus.
					</Link>
				</div>

				<div className="mt-auto mb-20 space-y-6">
					<h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
						Landing your dream job <br /> is now automated.
					</h2>
					<p className="text-white/70 text-sm max-w-xs">
						With Nexus, you can find and apply for jobs that match your skills
						and interests.
					</p>
				</div>
			</div>
			{/* right */}
			<div className="flex flex-col items-center w-full md:w-1/2 p-8 mt-4 md:p-12">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
					<p className="text-sm text-muted-foreground mt-2">
						Sign in to your AI job assistant.
					</p>
				</div>
				<div className="grid grid-cols-2 gap-4 w-full max-w-sm">
					<Button
						variant="outline"
						className="h-10 flex gap-2 font-semibold tracking-tight"
					>
						<GoogleIcon className="mr-2 h-4 w-4" /> Google
					</Button>
					<Button variant="outline" className="h-10 flex gap-2 font-semibold">
						<AppleIcon className="mr-2 h-4 w-4" /> Apple
					</Button>
				</div>

				<div className="relative my-4 w-full max-w-sm">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t"></span>
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Or continue with
						</span>
					</div>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4 w-full max-w-sm"
				>
					<div className="space-y-2">
						<Label className="text-sm font-semibold">Email</Label>
						<Input
							{...register('email')}
							className="h-12 bg-muted border-none"
							aria-invalid={errors?.email ? 'true' : 'false'}
							type="email"
						/>
						{errors?.email && (
							<p className="text-red-500 text-[12px]">{errors.email.message}</p>
						)}
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label>Password</Label>
							<Link
								href="/forgot-password"
								className="text-sm text-digital-blue-600 font-semibold"
							>
								Forgot Password?
							</Link>
						</div>
						<Input
							{...register('password')}
							aria-invalid={errors?.password ? 'true' : 'false'}
							className="h-12 bg-muted border-none"
							type="password"
						/>
						{errors?.password && (
							<p className="text-red-500 text-[12px]">
								{errors.password.message}
							</p>
						)}
					</div>
					<Button
						className="w-full mt-2 h-12 text-lg font-semibold bg-digital-blue-500 hover:bg-digital-blue-500/90 hover:scale-105 transition-all duration-300 dark:text-white"
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Signing In...' : 'Sign In'}
					</Button>
				</form>
				<div className="mt-2">
					<p className="text-sm text-muted-foreground">
						Don't have an account?{' '}
						<Link
							className="text-digital-blue-600 font-semibold"
							href="/sign-up"
						>
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
