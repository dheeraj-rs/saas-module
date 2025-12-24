/**
 * Form Select Component
 *
 * Reusable select field with validation
 */

import React from 'react';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export function FormSelect<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  placeholder = 'Select an option',
  options,
  required = false,
  disabled = false,
  className,
  description,
}: FormSelectProps<TFieldValues>) {
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
      {label && (
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <Select
        value={value as string}
        onValueChange={(val) => setValue(name, val as any)}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            hasError && 'border-destructive focus:ring-destructive'
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {description && !hasError && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {hasError && (
        <p className="text-sm text-destructive">{error?.message as string}</p>
      )}
    </div>
  );
}
