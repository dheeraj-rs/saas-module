/**
 * Form Checkbox Component
 *
 * Reusable checkbox field with validation
 */

import React from 'react';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface FormCheckboxProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormCheckbox<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
}: FormCheckboxProps<TFieldValues>) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const error = errors[name];
  const hasError = !!error;
  const value = watch(name);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start space-x-3">
        <Checkbox
          id={name}
          checked={value as boolean}
          onCheckedChange={(checked) => setValue(name, checked as any)}
          disabled={disabled}
          className={cn(hasError && 'border-destructive')}
        />
        <div className="flex-1 space-y-1">
          <Label
            htmlFor={name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {description && !hasError && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {hasError && (
        <p className="text-sm text-destructive ml-7">
          {error?.message as string}
        </p>
      )}
    </div>
  );
}
