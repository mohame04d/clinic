import { Suspense } from 'react';
import { Loader } from 'lucide-react';
import Otp from '@/src/features/auth/components/otp';

export default function OTPPage() {
  // SECURITY: The timer is computed on the server from an HTTP-only cookie.
  // The client receives only the remaining seconds — it cannot read or
  // tamper with the underlying timestamp.

  return (
    <div className="bg-background flex min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden">
      <div className="flex w-full flex-col gap-5 items-center max-w-sm">
        <h1 className="text-3xl font-semibold">Verify OTP</h1>
        <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out fill-mode-both">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-96">
                <Loader className="animate-spin" size={24} />
              </div>
            }
          >
            <Otp />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
