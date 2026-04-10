'use server';

// SECURITY: Next.js Server Actions execute code securely on the server.
// Using this directly hides the API URL and any potential payload structure
// from the client's 'Network' tab, minimizing the attack surface.

import { redirect } from 'next/navigation';
import { apiPost, ApiError } from '@/src/lib/api-client';
import {
  setAuthCookies,
  setResetEmail,
  getResetEmail,
  setResetToken,
  getResetToken,
  clearResetData,
} from '@/src/lib/auth-cookies';
import {
  loginFormSchema,
  SignUpFormSchema,
  forgetPasswordSchema,
  otpFormSchema,
  resetPasswordSchema,
} from '@/src/validations/zod';

// ---------- Shared result type ----------
export type ActionResult = {
  success: boolean;
  errorMessage: Record<string, string[]>;
};

// ---------- NestJS response types ----------
interface AuthResponse {
  status: string;
  data: { id: string; name: string; email: string; role: 'PATIENT' | 'DOCTOR' };
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

// =========================
// SIGN IN
// =========================
export async function signInAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const value = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsed = loginFormSchema.safeParse(value);
  if (!parsed.success) {
    return { success: false, errorMessage: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    const res = await apiPost<AuthResponse>('/auth/sign-in', {
      email: parsed.data.email,
      password: parsed.data.password,
    });

    await setAuthCookies(res.access_token, res.refresh_token);

    const redirectPath = res.data.role === 'DOCTOR' ? '/doctor' : '/patient';
    redirect(redirectPath);
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, errorMessage: { server: [err.message] } };
    }
    throw err; // re-throw redirect errors (Next.js uses throw for redirect)
  }
}

// =========================
// SIGN UP
// =========================
export async function signUpAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const value = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const parsed = SignUpFormSchema.safeParse(value);
  if (!parsed.success) {
    return { success: false, errorMessage: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    const res = await apiPost<AuthResponse>('/auth/sign-up', {
      name: parsed.data.username,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    await setAuthCookies(res.access_token, res.refresh_token);
    await setResetEmail(parsed.data.email);

    redirect('/verify-email?flow=signup');
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, errorMessage: { server: [err.message] } };
    }
    throw err;
  }
}

// =========================
// FORGOT PASSWORD
// =========================
export async function forgotPasswordAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const value = {
    email: formData.get('email') as string,
  };

  const parsed = forgetPasswordSchema.safeParse(value);
  if (!parsed.success) {
    return { success: false, errorMessage: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await apiPost<MessageResponse>('/auth/reset-password', {
      email: parsed.data.email,
    });

    await setResetEmail(parsed.data.email);

    redirect('/verify-email?flow=reset');
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, errorMessage: { server: [err.message] } };
    }
    throw err;
  }
}

// =========================
// VERIFY CODE
// =========================
export async function verifyCodeAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const value = {
    otp: formData.get('otp') as string,
  };
  const flow = formData.get('flow') as string || 'reset';

  const parsed = otpFormSchema.safeParse(value);
  if (!parsed.success) {
    return { success: false, errorMessage: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    const email = await getResetEmail();
    if (!email) {
      return { success: false, errorMessage: { server: ['Session expired. Please start over.'] } };
    }

    const res = await apiPost<VerifyCodeResponse>('/auth/verify-code', {
      email,
      code: parsed.data.otp,
    });

    if (flow === 'signup') {
      redirect('/patient');
    } else {
      await setResetToken(res.resetToken);
      redirect('/reset-password');
    }
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, errorMessage: { server: [err.message] } };
    }
    throw err;
  }
}

// =========================
// RESEND CODE (no FormData)
// =========================
export async function resendCodeAction(): Promise<ActionResult> {
  try {
    const email = await getResetEmail();
    if (!email) {
      return { success: false, errorMessage: { server: ['Session expired. Please start over.'] } };
    }

    await apiPost<MessageResponse>('/auth/reset-password', { email });

    return { success: true, errorMessage: {} };
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, errorMessage: { server: [err.message] } };
    }
    return { success: false, errorMessage: { server: ['Failed to resend code'] } };
  }
}

// =========================
// CHANGE PASSWORD
// =========================
export async function changePasswordAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const value = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const parsed = resetPasswordSchema.safeParse(value);
  if (!parsed.success) {
    return { success: false, errorMessage: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    const email = await getResetEmail();
    const resetToken = await getResetToken();

    if (!email || !resetToken) {
      return {
        success: false,
        errorMessage: { server: ['Session expired. Please start the reset process again.'] },
      };
    }

    await apiPost<MessageResponse>('/auth/change-password', {
      email,
      password: parsed.data.password,
      resetToken,
    });

    await clearResetData();

    redirect('/sign-in');
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, errorMessage: { server: [err.message] } };
    }
    throw err;
  }
}
