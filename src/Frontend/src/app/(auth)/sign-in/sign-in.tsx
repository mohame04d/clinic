'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';

// Make sure your schema path is correct!
import { loginFormSchema } from '@/src/validations/zod';
import { AuthTabs } from '@/src/features/auth/components/authTabs';

export function LoginForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: '', password: '' },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  // Allows users to press "Enter" to quickly jump to the next field
  const handleFocusNext =
    (focusNext: 'username' | 'password') =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        form.setFocus(focusNext);
      }
    };

  // Your submit handler to send data to NestJS will go here eventually!
  const onSubmit = (data: z.infer<typeof loginFormSchema>) => {
    console.log('Form Submitted!', data);
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-border/50">
      <AuthTabs activeTab="sign-in" />
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* USERNAME FIELD */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-backwards">
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                type="email"
                placeholder="Enter your Email"
                {...form.register('username')}
                onKeyDown={handleFocusNext('password')}
                aria-invalid={!!form.formState.errors.username}
              />
              <FieldError>{form.formState.errors.username?.message}</FieldError>
            </Field>
          </div>

          {/* PASSWORD FIELD */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-backwards">
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...form.register('password')}
                aria-invalid={!!form.formState.errors.password}
              />
              <FieldError>{form.formState.errors.password?.message}</FieldError>
            </Field>

            <Link
              href="/forget-password"
              className="inline-block w-full text-right text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-primary transition-colors mt-2"
            >
              Forgot your password?
            </Link>
          </div>

          {/* MAIN SUBMIT BUTTON */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-backwards pt-2">
            <Button
              type="submit"
              className="w-full py-5 active:scale-[0.98] transition-transform"
            >
              Login
            </Button>
          </div>

          {/* DIVIDER */}
          <div className="relative my-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 fill-mode-backwards">
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
          <div className="space-y-3 flex gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms] fill-mode-backwards">
            <Button
              type="button"
              variant="outline"
              className="flex-1 py-5 flex items-center justify-center hover:bg-muted active:scale-[0.98] transition-all group"
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
