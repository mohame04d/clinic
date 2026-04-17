// src/components/auth/sign-up.tsx
'use client';

import { useActionState, useState } from 'react';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Circle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/src/components/ui/field';
import { cn } from '@/src/lib/utils';
import { SignUpFormSchema } from '@/src/validations/zod';
import { passwordRules } from '@/src/validations/passwordRules';
import { AuthTabs } from '@/src/features/auth/components/authTabs';
import { signUpAction } from '@/src/features/auth/actions/auth-actions';
import type { ActionResult } from '@/src/features/auth/actions/auth-actions';

const PASSWORD_COLORS = ['#FF4D4F', '#FAAD14', '#40A9FF', '#52C41A'];

export function SignUpForm() {
  const {
    register,
    control,
    setFocus,
    formState: { errors },
  } = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [state, action, pending] = useActionState<ActionResult, FormData>(
    signUpAction,
    { success: false, errorMessage: {} },
  );

  const [seePassword, setSeePassword] = useState(false);

  const passwordValue = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });
  const isPasswordEmpty = passwordValue === '';

  const passwordStatus = passwordRules.map((rule) => ({
    ...rule,
    passed: rule.test(passwordValue),
  }));

  const passwordStrength =
    (passwordStatus.filter((r) => r.passed).length / passwordRules.length) *
    100;

  const handleFocusNext =
    (field: 'username' | 'email' | 'password' | 'confirmPassword') =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        setFocus(field);
      }
    };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-border/50">
      <AuthTabs activeTab="sign-up" />
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

          {/* USERNAME */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                className="transition-all focus:ring-2 focus:ring-primary/20"
                disabled={pending}
                aria-invalid={!!errors.username}
                {...register('username')}
                onKeyDown={handleFocusNext('email')}
              />
              <FieldError>
                {errors.username?.message || state.errorMessage.username?.[0]}
              </FieldError>
            </Field>
          </div>

          {/* EMAIL */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="transition-all focus:ring-2 focus:ring-primary/20"
                disabled={pending}
                aria-invalid={!!errors.email}
                {...register('email')}
                onKeyDown={handleFocusNext('password')}
              />
              <FieldError>
                {errors.email?.message || state.errorMessage.email?.[0]}
              </FieldError>
            </Field>
          </div>

          {/* PASSWORD */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={seePassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`transition-all focus:ring-2 focus:ring-primary/20 ${errors.password?.message && 'border-destructive bg-destructive/10 text-destructive'}`}
                  disabled={pending}
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  onKeyDown={handleFocusNext('confirmPassword')}
                />

                {!isPasswordEmpty && (
                  <button
                    type="button"
                    onClick={() => setSeePassword((p) => !p)}
                    className={`flex justify-center items-center  h-[95%] w-10 absolute right-0.25 rounded-r-md top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${errors.password?.message ? 'border-destructive bg-red-200  text-destructive' : 'bg-white'}`}
                  >
                    {seePassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                )}
              </div>

              {errors.password?.message || state.errorMessage.password?.[0] ? (
                <FieldError>
                  {errors.password?.message || state.errorMessage.password?.[0]}
                </FieldError>
              ) : (
                <FieldDescription>
                  Password must satisfy all rules below.
                </FieldDescription>
              )}

              {/* Strength Bar */}
              <div className="flex gap-2 items-center mt-2">
                <div className="w-[95%] flex gap-1">
                  {[25, 50, 75, 100].map((limit, idx) => (
                    <div
                      key={limit}
                      className="h-1.5 flex-1 rounded-full transition-all duration-500 ease-out"
                      style={{
                        backgroundColor:
                          passwordStrength >= limit
                            ? PASSWORD_COLORS[idx]
                            : 'var(--muted)',
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-xs font-medium w-14 text-right transition-colors duration-300"
                  style={{
                    color:
                      passwordStrength > 0
                        ? PASSWORD_COLORS[
                            Math.max(0, Math.ceil(passwordStrength / 25) - 1)
                          ]
                        : 'inherit',
                  }}
                >
                  {passwordStrength === 100
                    ? 'Strong'
                    : passwordStrength >= 75
                      ? 'Good'
                      : passwordStrength >= 50
                        ? 'Medium'
                        : passwordStrength > 0
                          ? 'Weak'
                          : ''}
                </span>
              </div>

              {/* Rules List */}
              <div className="pt-2 grid grid-cols-2 gap-y-2">
                {passwordStatus.map((rule) => (
                  <p
                    key={rule.message}
                    className={cn(
                      'flex items-center gap-2 text-xs transition-colors duration-300',
                      rule.passed
                        ? 'text-green-600 dark:text-green-500'
                        : errors.password
                          ? 'text-destructive'
                          : 'text-muted-foreground',
                    )}
                  >
                    {rule.passed ? (
                      <Check
                        size={14}
                        className="animate-in zoom-in spin-in-12 duration-300 text-green-600 dark:text-green-500"
                      />
                    ) : (
                      <Circle size={14} className="opacity-50" />
                    )}
                    {rule.message}
                  </p>
                ))}
              </div>
            </Field>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="transition-all focus:ring-2 focus:ring-primary/20"
                disabled={pending}
                {...register('confirmPassword')}
                aria-invalid={!!errors.confirmPassword}
              />
              <FieldError>
                {errors.confirmPassword?.message || state.errorMessage.confirmPassword?.[0]}
              </FieldError>
            </Field>
          </div>

          {/* SUBMIT */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms] fill-mode-both pt-2">
            <Button
              type="submit"
              disabled={pending}
              className="w-full py-5 active:scale-[0.98] transition-transform"
            >
              {pending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Signing up...
                </span>
              ) : (
                'Sign Up'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
