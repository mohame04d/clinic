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

  let redirectPath = '/patient';

  if (accessToken && refreshToken) {
    await setAuthCookies(accessToken, refreshToken);

    // SECURITY: Decode JWT role to determine the correct dashboard.
    // We only decode (not verify) because verification happens on the backend.
    try {
      const payloadBase64 = accessToken.split('.')[1];
      const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
      const decoded = JSON.parse(decodedJson);

      if (decoded.role === 'DOCTOR') {
        redirectPath = '/doctor';
      }
    } catch (error) {
      console.error('Failed to parse JWT for role-based redirect', error);
    }
  }

  // Redirect the user to their dashboard, clearing the tokens from the URL.
  return NextResponse.redirect(new URL(redirectPath, request.url));
}
