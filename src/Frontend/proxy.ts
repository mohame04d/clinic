import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// SECURITY: This middleware acts as our Authorization Proxy.
// It intercepts requests before they hit the pages, checking for the presence of the HTTP-only access_token.
// - Prevents unauthenticated users from accessing protected pages (e.g. /patient, /doctor).
// - Prevents authenticated users from accessing auth-related pages (e.g. /sign-in, /sign-up).
export default function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Define route categories
  const authRoutes = [
    '/sign-in',
    '/sign-up',
    '/forget-password',
    '/verify-email',
    '/reset-password',
  ];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Define protected routes (you can expand this array as your app grows)
  const protectedRoutes = ['/patient', '/doctor'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isAuthRoute && token) {
    // SECURITY: Authenticated user attempting to visit an auth page.
    // Redirect them to the dashboard to prevent confusing states.
    return NextResponse.redirect(new URL('/patient', request.url));
  }

  if (isProtectedRoute && !token) {
    // SECURITY: Unauthenticated user attempting to visit a protected page.
    // Redirect them to the login page to enforce authorization.
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

// Config specifies which routes the middleware should run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (like images in the public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
