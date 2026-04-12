import { NextResponse } from 'next/server';
import { setAuthCookies } from '@/src/lib/auth-cookies';

export async function GET(request: Request) {
  // SECURITY: This route intercepts the redirect from the NestJS Google OAuth callback.
  // We extract the tokens from the URL and immediately set them as HTTP-only cookies.
  // This prevents the tokens from lingering in the browser's address bar or history,
  // securing them against Cross-Site Scripting (XSS) attacks.
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  if (accessToken && refreshToken) {
    await setAuthCookies(accessToken, refreshToken);
  }

  // Redirect the user to their dashboard, clearing the tokens from the URL.
  return NextResponse.redirect(new URL('/patient', request.url));
}
