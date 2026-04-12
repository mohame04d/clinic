'use client';

import { useState, useEffect, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';

import { otpFormSchema } from '@/src/validations/zod';

export default function OTPForm() {
  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: '' },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-border/50">
      <CardContent>
        <form className="space-y-4">
          {/* OTP FIELD */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <Field>
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>
              <Input
                id="otp"
                type="text"
                autoFocus
                maxLength={6}
                placeholder="Enter OTP"
                className="transition-all focus:ring-2 focus:ring-primary/20"
                aria-invalid={!!form.formState.errors.otp}
                {...form.register('otp')}
              />
              <FieldError>{form.formState.errors.otp?.message}</FieldError>
            </Field>
          </div>

          {/* VERIFY BUTTON */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both pt-2">
            <Button
              type="submit"
              className="w-full py-5 active:scale-[0.98] transition-transform"
            >
              Verify OTP
            </Button>
          </div>

          {/* RESEND & TIMER */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setTimeLeft(300);
              }}
            >
              Resend Code
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              OTP expires in:{' '}
              {Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, '0')}
              :{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
