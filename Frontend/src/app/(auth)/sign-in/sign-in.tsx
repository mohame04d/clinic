'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { loginFormSchema } from '@/src/validations/zod';
import { AuthTabs } from '@/src/features/auth/components/authTabs';
import { signInAction } from '@/src/features/auth/actions/auth-actions';
import type { ActionResult } from '@/src/features/auth/actions/auth-actions';

export function LoginForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const [state, action, pending] = useActionState<ActionResult, FormData>(
    signInAction,
    { success: false, errorMessage: {} },
  );

  const [seePassword, setSeePassword] = useState(false);
  const passwordValue = form.watch('password');
  const isPasswordEmpty = passwordValue === '';

  const handleFocusNext =
    (focusNext: 'email' | 'password') =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        form.setFocus(focusNext);
      }
    };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-border/50">
      <AuthTabs activeTab="sign-in" />
      <CardContent>
        <form action={action} className="space-y-4">
          {/* SERVER ERROR */}
          {state.errorMessage?.server && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-destructive text-sm text-center bg-destructive/10 rounded-md py-2 px-3">
                {state.errorMessage.server[0]}
              </p>
            </div>
          )}

          {/* EMAIL FIELD */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your Email"
                disabled={pending}
                {...form.register('email')}
                onKeyDown={handleFocusNext('password')}
                aria-invalid={!!form.formState.errors.email}
              />
              <FieldError>
                {form.formState.errors.email?.message || state.errorMessage.email?.[0]}
              </FieldError>
            </Field>
          </div>

          {/* PASSWORD FIELD */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={seePassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  disabled={pending}
                  {...form.register('password')}
                  aria-invalid={!!form.formState.errors.password}
                />
                {!isPasswordEmpty && (
                  <button
                    type="button"
                    onClick={() => setSeePassword((p) => !p)}
                    className={`flex justify-center items-center  h-[95%] w-10 absolute right-0.25 rounded-r-md top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${form.formState.errors.password?.message ? 'border-destructive bg-red-200  text-destructive' : 'bg-white'}`}
                  >
                    {seePassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                )}
              </div>
              <FieldError>
                {form.formState.errors.password?.message || state.errorMessage.password?.[0]}
              </FieldError>
            </Field>

            <Link
              href="/forget-password"
              className="inline-block w-full text-right text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-primary transition-colors mt-2"
            >
              Forgot your password?
            </Link>
          </div>

          {/* MAIN SUBMIT BUTTON */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both pt-2">
            <Button
              type="submit"
              disabled={pending}
              className="w-full py-5 active:scale-[0.98] transition-transform"
            >
              {pending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Signing in...
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </div>

          {/* DIVIDER */}
          <div className="relative my-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms] fill-mode-both">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* SOCIAL LOGINS */}
          <div className="space-y-3 flex gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms] fill-mode-both">
            <Button
              type="button"
              variant="outline"
              className="flex-1 py-5 flex items-center justify-center hover:bg-muted active:scale-[0.98] transition-all group"
              onClick={() => {
                // SECURITY: Initiate OAuth flow directly with the backend.
                window.location.href = 'http://localhost:4000/api/v1/auth/google/sign';
              }}
            >
              <Image
                src="/icons8-google-logo.svg"
                alt="google"
                width={20}
                height={20}
              />
              <span className="ml-2 font-medium">Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1 py-5 flex items-center justify-center hover:bg-muted active:scale-[0.98] transition-all group"
            >
              <Image
                src="/icon8-apple.webp"
                alt="apple"
                width={30}
                height={30}
              />
              <span className="ml-2 font-medium">Apple</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
