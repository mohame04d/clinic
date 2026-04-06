'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';

import { forgetPasswordSchema } from '@/src/validations/zod';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/src/components/ui/field';

export default function ForgetPasswordPreview() {
  const form = useForm({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: { username: '' },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-border/50">
      <CardContent>
        <form className="space-y-4">
          {/* EMAIL FIELD */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <Field>
              <FieldLabel htmlFor="username">Email</FieldLabel>
              <Input
                id="username"
                type="email"
                placeholder="johndoe@mail.com"
                autoComplete="email"
                className="transition-all focus:ring-2 focus:ring-primary/20"
                aria-invalid={!!form.formState.errors.username}
                {...form.register('username')}
              />
              <FieldError>
                {form.formState.errors?.username?.message}
              </FieldError>
              <FieldDescription>
                We'll send you a reset link if this email exists.
              </FieldDescription>
            </Field>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both pt-2">
            <Button
              type="submit"
              className="w-full py-5 active:scale-[0.98] transition-transform"
            >
              Send Reset Link
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
