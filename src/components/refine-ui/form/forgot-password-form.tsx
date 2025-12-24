'use client';

import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

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

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const Link = useLink();

  const { title } = useRefineOptions();

  const { mutate: forgotPassword } = useForgotPassword();

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      validateEmail(value);
    } else {
      setEmailError('');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      return;
    }

    forgotPassword({
      email,
    });
  };

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
          <form onSubmit={handleForgotPassword} className={cn('space-y-5')}>
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
                required
                value={email}
                onChange={handleEmailChange}
                className={cn(
                  'h-11',
                  'text-base',
                  'placeholder:text-muted-foreground/60',
                  emailError
                    ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive focus-visible:ring-2'
                    : ''
                )}
              />
              {emailError && (
                <p className={cn('text-xs', 'text-destructive', 'mt-1.5')}>
                  {emailError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
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
              Send reset link
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
