/**
 * Form Field Component
 *
 * Reusable form field wrapper with validation and error display
 */

import React from 'react';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FormFieldProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'date'
    | 'datetime-local';
  as?: 'input' | 'textarea';
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export function FormField<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  as = 'input',
  rows = 4,
  required = false,
  disabled = false,
  className,
  description,
}: FormFieldProps<TFieldValues>) {
  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name];
  const hasError = !!error;

  const InputComponent = as === 'textarea' ? Textarea : Input;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <InputComponent
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        rows={as === 'textarea' ? rows : undefined}
        className={cn(
          hasError && 'border-destructive focus-visible:ring-destructive'
        )}
        {...register(name)}
      />

      {description && !hasError && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {hasError && (
        <p className="text-sm text-destructive">{error?.message as string}</p>
      )}
    </div>
  );
}
