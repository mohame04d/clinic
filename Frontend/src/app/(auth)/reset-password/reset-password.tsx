'use client';

import { useActionState, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

import { resetPasswordSchema } from '@/src/validations/zod';
import { passwordRules } from '@/src/validations/passwordRules';
import { changePasswordAction } from '@/src/features/auth/actions/auth-actions';
import type { ActionResult } from '@/src/features/auth/actions/auth-actions';

const PASSWORD_COLORS = ['#FF4D4F', '#FAAD14', '#40A9FF', '#52C41A'];

export default function ResetPasswordForm() {
  const {
    register,
    control,
    setFocus,
    formState: { errors, isSubmitted },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const [state, action, pending] = useActionState<ActionResult, FormData>(
    changePasswordAction,
    { success: false, errorMessage: {} },
  );

  const [blurredWithContent, setBlurredWithContent] = useState({
    password: false,
    confirmPassword: false,
  });

  const [seePassword, setSeePassword] = useState(false);

  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' });
  const confirmPasswordValue = useWatch({ control, name: 'confirmPassword', defaultValue: '' });

  const isPasswordEmpty = passwordValue === '';
  const isConfirmPasswordEmpty = confirmPasswordValue === '';

  const showPasswordError =
    !!errors.password && (isSubmitted || (blurredWithContent.password && !isPasswordEmpty));
  const showConfirmPasswordError =
    !!errors.confirmPassword &&
    (isSubmitted || (blurredWithContent.confirmPassword && !isConfirmPasswordEmpty));

  const passwordRegister = register('password');
  const confirmPasswordRegister = register('confirmPassword');

  const passwordStatus = passwordRules.map((rule) => ({
    ...rule,
    passed: rule.test(passwordValue),
  }));

  const passwordStrength =
    (passwordStatus.filter((r) => r.passed).length / passwordRules.length) *
    100;

  const handleFocusNext =
    (field: 'password' | 'confirmPassword') =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        setFocus(field);
      }
    };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-border/50">
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

          {/* PASSWORD FIELD */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <Field>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={seePassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className={`transition-all focus:ring-2 focus:ring-primary/20 ${errors.password?.message && showPasswordError && 'border-destructive bg-destructive/10 text-destructive'}`}
                  disabled={pending}
                  {...passwordRegister}
                  onBlur={(e) => {
                    passwordRegister.onBlur(e);
                    setBlurredWithContent((prev) => ({ ...prev, password: e.target.value !== '' }));
                  }}
                  aria-invalid={!!(showPasswordError ? errors.password?.message : null)}
                  onKeyDown={handleFocusNext('confirmPassword')}
                  required
                />

                {!isPasswordEmpty && (
                  <button
                    type="button"
                    onClick={() => setSeePassword((p) => !p)}
                    className={`flex justify-center items-center  h-[95%] w-10 absolute right-0.25 rounded-r-md top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${errors.password?.message && showPasswordError ? 'border-destructive bg-red-200  text-destructive' : 'bg-white'}`}
                  >
                    {seePassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                )}
              </div>

              {(showPasswordError ? errors.password?.message : null) || state.errorMessage.password?.[0] ? (
                <FieldError>
                  {(showPasswordError ? errors.password?.message : null) || state.errorMessage.password?.[0]}
                </FieldError>
              ) : (
                <FieldDescription>
                  Your password must satisfy all rules below.
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
                        : errors.password && showPasswordError
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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="transition-all focus:ring-2 focus:ring-primary/20"
                disabled={pending}
                {...confirmPasswordRegister}
                onBlur={(e) => {
                  confirmPasswordRegister.onBlur(e);
                  setBlurredWithContent((prev) => ({ ...prev, confirmPassword: e.target.value !== '' }));
                }}
                aria-invalid={!!(showConfirmPasswordError ? errors.confirmPassword?.message : null)}
                required
              />
              <FieldError>
                {(showConfirmPasswordError ? errors.confirmPassword?.message : null) ||
                  state.errorMessage.confirmPassword?.[0]}
              </FieldError>
            </Field>
          </div>

          {/* SUBMIT */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both pt-2">
            <Button
              type="submit"
              disabled={pending}
              className="w-full py-5 active:scale-[0.98] transition-transform"
            >
              {pending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Resetting...
                </span>
              ) : (
                'Reset Password'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
