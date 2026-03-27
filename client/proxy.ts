import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
	const sessionToken = request.cookies.get('better-auth.session_token');
	const { pathname } = request.nextUrl;

	// Auth routes
	const isAuthRoute =
		pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

	// Dashboard routes Includes all routes in your (dashboard) group
	const isDashboardRoute =
		pathname.startsWith('/dashboard') ||
		pathname.startsWith('/profile') ||
		pathname.startsWith('/tailor-station') ||
		pathname.startsWith('/application-tracker');

	// Redirect to sign-in if accessing dashboard without session
	if (isDashboardRoute && !sessionToken) {
		return NextResponse.redirect(new URL('/sign-in', request.url));
	}

	// Redirect to dashboard if accessing auth routes with session
	if (isAuthRoute && sessionToken) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	// Allow all other routes
	return NextResponse.next();
}

export const config = {
	matcher: [
		'/dashboard/:path*',
		'/profile/:path*',
		'/tailor-station/:path*',
		'/application-tracker/:path*',
		'/sign-in/:path*',
		'/sign-up/:path*',
	],
};
