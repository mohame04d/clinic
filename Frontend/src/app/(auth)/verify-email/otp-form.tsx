'use client';

import { useActionState, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';

import { otpFormSchema } from '@/src/validations/zod';
import {
  verifyCodeAction,
  resendCodeAction,
} from '@/src/features/auth/actions/auth-actions';
import type { ActionResult } from '@/src/features/auth/actions/auth-actions';

export default function OTPForm() {
  const searchParams = useSearchParams();
  const flow = searchParams.get('flow') || 'reset';

  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: '' },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const [state, action, pending] = useActionState<ActionResult, FormData>(
    verifyCodeAction,
    { success: false, errorMessage: {} },
  );

  const [timeLeft, setTimeLeft] = useState(300);
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResend = async () => {
    setResending(true);
    setResendError('');
    try {
      const result = await resendCodeAction();
      if (result.success) {
        setTimeLeft(300);
      } else {
        setResendError(result.errorMessage?.server?.[0] || 'Failed to resend');
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-border/50">
      <CardContent>
        <form action={action} className="space-y-4">
          {/* Hidden flow input for the server action */}
          <input type="hidden" name="flow" value={flow} />

          {/* SERVER ERROR */}
          {(state.errorMessage?.server || resendError) && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-destructive text-sm text-center bg-destructive/10 rounded-md py-2 px-3">
                {state.errorMessage?.server?.[0] || resendError}
              </p>
            </div>
          )}

          {/* INFO */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75 fill-mode-both">
            <p className="text-sm text-muted-foreground text-center">
              Enter the 6-digit verification code sent to your email
            </p>
          </div>

          {/* OTP FIELD */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <Field>
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>
              <Input
                id="otp"
                name="otp"
                type="text"
                autoFocus
                maxLength={6}
                placeholder="Enter OTP"
                className="transition-all focus:ring-2 focus:ring-primary/20 text-center text-lg tracking-widest"
                disabled={pending}
                aria-invalid={!!form.formState.errors.otp}
                {...form.register('otp')}
              />
              <FieldError>
                {form.formState.errors.otp?.message || state.errorMessage.otp?.[0]}
              </FieldError>
            </Field>
          </div>

          {/* VERIFY BUTTON */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both pt-2">
            <Button
              type="submit"
              disabled={pending}
              className="w-full py-5 active:scale-[0.98] transition-transform"
            >
              {pending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </Button>
          </div>

          {/* RESEND & TIMER */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both text-center">
            <Button
              type="button"
              variant="link"
              disabled={resending || timeLeft > 0}
              onClick={handleResend}
            >
              {resending ? (
                <Loader2 className="animate-spin mr-2" size={14} />
              ) : null}
              Resend Code
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              {timeLeft > 0 ? (
                <>
                  Resend available in:{' '}
                  {Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, '0')}
                  :{(timeLeft % 60).toString().padStart(2, '0')}
                </>
              ) : (
                "Didn't receive the code? Click resend above."
              )}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
