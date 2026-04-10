// ---------- JWT Tokens ----------
export function saveTokens(accessToken: string, refreshToken: string) {
  sessionStorage.setItem('access_token', accessToken);
  sessionStorage.setItem('refresh_token', refreshToken);
}

export function getAccessToken(): string | null {
  return sessionStorage.getItem('access_token');
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem('refresh_token');
}

export function clearTokens() {
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
}

// ---------- Reset Flow (email + token) ----------
export function saveResetEmail(email: string) {
  sessionStorage.setItem('reset_email', email);
}

export function getResetEmail(): string {
  return sessionStorage.getItem('reset_email') || '';
}

export function saveResetToken(token: string) {
  sessionStorage.setItem('reset_token', token);
}

export function getResetToken(): string {
  return sessionStorage.getItem('reset_token') || '';
}

export function clearResetData() {
  sessionStorage.removeItem('reset_email');
  sessionStorage.removeItem('reset_token');
}
