/**
 * Custom Form Validation Hook
 * 
 * Wrapper around React Hook Form with Zod validation
 * Provides consistent error handling and form state management
 */

import { useForm, UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback } from 'react';
import { errorLogger } from '../services/errorLogger';

interface UseFormValidationOptions<TSchema extends z.ZodType<any, any, any>>
  extends Omit<UseFormProps<z.infer<TSchema>>, 'resolver'> {
  schema: TSchema;
  onSubmit: (data: z.infer<TSchema>) => Promise<void> | void;
  onError?: (errors: any) => void;
}

export function useFormValidation<TSchema extends z.ZodType<any, any, any>>({
  schema,
  onSubmit,
  onError,
  ...formOptions
}: UseFormValidationOptions<TSchema>): UseFormReturn<z.infer<TSchema>> & {
  handleSubmitWithValidation: (e?: React.BaseSyntheticEvent) => Promise<void>;
} {
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    mode: 'onBlur', // Validate on blur for better UX
    ...formOptions,
  });

  const handleSubmitWithValidation = useCallback(
    async (e?: React.BaseSyntheticEvent) => {
      e?.preventDefault();

      try {
        await form.handleSubmit(
          async (data) => {
            try {
              await onSubmit(data);
            } catch (error) {
              // Log submission errors
              errorLogger.logError(error as Error, {
                context: 'Form submission',
                formData: data,
              });

              // Set form-level error
              form.setError('root', {
                type: 'manual',
                message:
                  error instanceof Error
                    ? error.message
                    : 'An error occurred while submitting the form',
              });
            }
          },
          (errors) => {
            // Log validation errors
            errorLogger.logWarning('Form validation failed', {
              errors,
            });

            if (onError) {
              onError(errors);
            }
          }
        )(e);
      } catch (error) {
        errorLogger.logError(error as Error, {
          context: 'Form validation',
        });
      }
    },
    [form, onSubmit, onError]
  );

  return {
    ...form,
    handleSubmitWithValidation,
  };
}

/**
 * Get field error message
 */
export function getFieldError(
  errors: any,
  fieldName: string
): string | undefined {
  const error = fieldName.split('.').reduce((obj, key) => obj?.[key], errors);
  return error?.message;
}

/**
 * Check if field has error
 */
export function hasFieldError(errors: any, fieldName: string): boolean {
  return !!getFieldError(errors, fieldName);
}
