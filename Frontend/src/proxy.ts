import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// SECURITY: Decode the JWT payload without verifying the signature.
// Signature verification happens on the backend — the middleware only needs
// the role claim to make routing decisions. This runs at the Edge, where
// full crypto libraries aren't always available.
function decodeJwtPayload(token: string): { role?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // ---------- Route classifications ----------
  const authRoutes = [
    '/sign-in',
    '/sign-up',
    '/forget-password',
    '/verify-email',
    '/reset-password',
  ];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPatientRoute = pathname.startsWith('/patient');
  const isDoctorRoute = pathname.startsWith('/doctor');
  const isProtectedRoute = isPatientRoute || isDoctorRoute;

  // ---------- Decode role from JWT ----------
  const payload = token ? decodeJwtPayload(token) : null;
  const role = payload?.role; // 'PATIENT' | 'DOCTOR' | undefined

  // ---------- Determine the correct dashboard for this user ----------
  const dashboardPath = role === 'DOCTOR' ? '/doctor' : '/patient';

  // =================================================================
  // RULE 1: Logged-in users visiting auth pages → redirect to dashboard
  // =================================================================
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // =================================================================
  // RULE 2: Unauthenticated users visiting protected pages → sign in
  // =================================================================
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // =================================================================
  // RULE 3: Role-based access control (authorization)
  // A PATIENT cannot access /doctors routes and vice-versa.
  // =================================================================
  if (isDoctorRoute && role && role !== 'DOCTOR') {
    return NextResponse.redirect(new URL('/patient', request.url));
  }
  if (isPatientRoute && role && role !== 'PATIENT') {
    return NextResponse.redirect(new URL('/doctor', request.url));
  }

  // =================================================================
  // RULE 4: Root path "/" — redirect logged-in users to their dashboard
  // =================================================================
  if (pathname === '/' && token && role) {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return NextResponse.next();
}

// Config specifies which routes the middleware should run on.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
