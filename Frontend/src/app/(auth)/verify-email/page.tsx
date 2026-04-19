import OTPForm from './otp-form';
import { getOtpSecondsRemaining } from '@/src/lib/auth-cookies';

export default async function OTPPage() {
  // SECURITY: The timer is computed on the server from an HTTP-only cookie.
  // The client receives only the remaining seconds — it cannot read or
  // tamper with the underlying timestamp.
  const initialSeconds = await getOtpSecondsRemaining();

  return (
    <div className="bg-background flex min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden">
      <div className="flex w-full flex-col gap-5 items-center max-w-sm">
        <h1 className="text-3xl font-semibold">Verify OTP</h1>
        <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out fill-mode-both">
          <OTPForm initialSecondsRemaining={initialSeconds} />
        </div>
      </div>
    </div>
  );
}
