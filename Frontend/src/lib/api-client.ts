import 'server-only';

// SECURITY: Using 'server-only' package ensures this file can NEVER be imported
// into client components. This protects our backend URL and any secret tokens
// from being exposed in the browser's JavaScript bundle.
const BASE_URL = process.env.NESTJS_URL || 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function apiPost<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new ApiError(msg || 'Something went wrong', res.status);
  }

  return data as T;
}
