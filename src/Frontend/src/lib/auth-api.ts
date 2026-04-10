import { apiPost } from './api-client';

// ---------- Response types ----------
interface AuthResponse {
  status: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: 'PATIENT' | 'DOCTOR';
  };
  access_token: string;
  refresh_token: string;
}

interface MessageResponse {
  status: string;
  message: string;
}

interface VerifyCodeResponse extends MessageResponse {
  resetToken: string;
}

// ---------- API functions ----------
export const authApi = {
  signUp(body: { name: string; email: string; password: string }) {
    return apiPost<AuthResponse>('/auth/sign-up', body);
  },

  signIn(body: { email: string; password: string }) {
    return apiPost<AuthResponse>('/auth/sign-in', body);
  },

  forgotPassword(body: { email: string }) {
    return apiPost<MessageResponse>('/auth/reset-password', body);
  },

  verifyCode(body: { email: string; code: string }) {
    return apiPost<VerifyCodeResponse>('/auth/verify-code', body);
  },

  changePassword(body: { email: string; password: string; resetToken: string }) {
    return apiPost<MessageResponse>('/auth/change-password', body);
  },

  refreshToken(refreshToken: string) {
    return apiPost<AuthResponse>('/auth/refresh-token', { refreshToken });
  },
};
