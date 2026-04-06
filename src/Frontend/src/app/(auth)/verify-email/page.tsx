import OTPForm from './otp-form';

export default async function OTPPage() {
  return (
    <div className="bg-background flex min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden">
      <div className="flex w-full flex-col gap-5 items-center max-w-sm">
        <h1 className="text-3xl font-semibold">Verify OTP</h1>
        <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out fill-mode-both">
          <OTPForm />
        </div>
      </div>
    </div>
  );
}
