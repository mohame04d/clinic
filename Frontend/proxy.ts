import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export default function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;
  
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
    return NextResponse.redirect(new URL('/patient', request.url));
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

// Config specifies which routes the middleware should run on.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
