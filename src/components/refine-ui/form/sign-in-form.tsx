'use client';

import { CircleHelp } from 'lucide-react';

import { InputPassword } from '@/components/refine-ui/form/input-password';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useLink, useLogin, useRefineOptions } from '@refinedev/core';
import { useFormValidation } from '@/shared/hooks/useFormValidation';
import { loginSchema, type LoginFormData } from '@/shared/validation';

export const SignInForm = () => {
  const Link = useLink();
  const { title } = useRefineOptions();
  const { mutate: login } = useLogin();

  // Use React Hook Form + Zod validation
  const form = useFormValidation({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onSubmit', // Only validate on submit
    reValidateMode: 'onChange', // After first submit, validate on change
    onSubmit: async (data: LoginFormData) => {
      // Refine automatically fetches user identity after successful login
      // via authProvider.getIdentity() and React Query invalidation
      login({
        email: data.email,
        password: data.password,
      });
    },
  });

  const {
    register,
    handleSubmitWithValidation,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = form;

  const rememberMe = watch('rememberMe');

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
              Sign in
            </CardTitle>
            <CardDescription
              className={cn(
                'text-base',
                'text-foreground',
                'dark:text-foreground/90',
                'font-normal'
              )}
            >
              Welcome back
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

            {/* Password Field */}
            <div className={cn('space-y-2')}>
              <Label
                htmlFor="password"
                className={cn('text-sm', 'font-medium', 'text-foreground')}
              >
                Password
              </Label>
              <InputPassword
                id="password"
                placeholder="Enter your password"
                {...register('password')}
                className={cn(
                  'h-11',
                  'text-base',
                  'placeholder:text-muted-foreground/60',
                  errors.password
                    ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive focus-visible:ring-1'
                    : ''
                )}
              />
              {errors.password && (
                <p className={cn('text-xs', 'text-destructive', 'mt-1.5')}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div
              className={cn('flex', 'items-center', 'justify-between', 'pt-1')}
            >
              <div className={cn('flex', 'items-center', 'space-x-2')}>
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setValue(
                      'rememberMe',
                      checked === 'indeterminate' ? false : checked
                    )
                  }
                />
                <Label
                  htmlFor="remember"
                  className={cn('text-sm', 'font-normal', 'cursor-pointer')}
                >
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className={cn(
                  'text-sm',
                  'font-medium',
                  'flex',
                  'items-center',
                  'gap-1.5',
                  'text-blue-600',
                  'dark:text-blue-400',
                  'hover:underline',
                  'transition-colors'
                )}
              >
                <span>Forgot password</span>
                <CircleHelp className={cn('w-4', 'h-4')} />
              </Link>
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
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

SignInForm.displayName = 'SignInForm';
