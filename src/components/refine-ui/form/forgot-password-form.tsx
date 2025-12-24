'use client';

import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useForgotPassword, useLink, useRefineOptions } from '@refinedev/core';
import { useFormValidation } from '@/shared/hooks/useFormValidation';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/shared/validation';

export const ForgotPasswordForm = () => {
  const Link = useLink();
  const { title } = useRefineOptions();
  const { mutate: forgotPassword } = useForgotPassword();

  // Use React Hook Form + Zod validation
  const form = useFormValidation({
    schema: forgotPasswordSchema,
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit', // Only validate on submit
    reValidateMode: 'onChange', // After first submit, validate on change
    onSubmit: async (data: ForgotPasswordFormData) => {
      forgotPassword({
        email: data.email,
      });
    },
  });

  const {
    register,
    handleSubmitWithValidation,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div
      className={cn(
        'flex',
        'items-center',
        'justify-center',
        'min-h-svh',
        'px-4',
        'py-8',
        'bg-background'
      )}
    >
      <Card className={cn('w-full', 'max-w-[500px]', 'shadow-lg', 'border')}>
        <CardContent className={cn('p-10', 'sm:p-12')}>
          {/* Logo */}
          {title.icon && (
            <div className={cn('flex', 'justify-center', 'mb-6')}>
              <div
                className={cn(
                  'text-primary',
                  '[&>svg]:w-16',
                  '[&>svg]:h-16',
                  '[&>svg]:sm:w-20',
                  '[&>svg]:sm:h-20'
                )}
              >
                {title.icon}
              </div>
            </div>
          )}

          {/* Header */}
          <div className={cn('text-center', 'mb-8')}>
            <CardTitle
              className={cn(
                'text-3xl',
                'sm:text-4xl',
                'font-bold',
                'text-blue-600',
                'dark:text-blue-400',
                'mb-2'
              )}
            >
              Forgot password
            </CardTitle>
            <CardDescription
              className={cn(
                'text-base',
                'text-foreground',
                'dark:text-foreground/90',
                'font-normal'
              )}
            >
              Enter your email to change your password.
            </CardDescription>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmitWithValidation}
            className={cn('space-y-5')}
          >
            {/* Email Field */}
            <div className={cn('space-y-2')}>
              <Label
                htmlFor="email"
                className={cn('text-sm', 'font-medium', 'text-foreground')}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={cn(
                  'h-11',
                  'text-base',
                  'placeholder:text-muted-foreground/60',
                  errors.email
                    ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive focus-visible:ring-1'
                    : ''
                )}
              />
              {errors.email && (
                <p className={cn('text-xs', 'text-destructive', 'mt-1.5')}>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className={cn(
                'w-full',
                'h-12',
                'mt-6',
                'text-base',
                'font-semibold',
                'bg-blue-600',
                'hover:bg-blue-700',
                'dark:bg-blue-600',
                'dark:hover:bg-blue-700',
                'transition-colors'
              )}
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className={cn('mt-8', 'text-center')}>
            <Link
              to="/login"
              className={cn(
                'inline-flex',
                'items-center',
                'gap-2',
                'text-sm',
                'font-medium',
                'text-blue-600',
                'dark:text-blue-400',
                'hover:underline',
                'transition-colors'
              )}
            >
              <ArrowLeft className={cn('w-4', 'h-4')} />
              <span>Back to sign in</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

ForgotPasswordForm.displayName = 'ForgotPasswordForm';
