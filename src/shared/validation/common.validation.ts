/**
 * Common Validation Rules
 * 
 * Reusable Zod validation schemas for common fields
 * Use these across all forms for consistency
 */

import { z } from 'zod';

/**
 * Email Validation
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

/**
 * Password Validation
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Simple Password (for less strict requirements)
 */
export const simplePasswordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters');

/**
 * Name Validation
 */
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .trim();

/**
 * Phone Number Validation (International format)
 */
export const phoneSchema = z
  .string()
  .regex(
    /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
    'Please enter a valid phone number'
  )
  .optional()
  .or(z.literal(''));

/**
 * URL Validation
 */
export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .optional()
  .or(z.literal(''));

/**
 * Required String
 */
export const requiredStringSchema = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`).trim();

/**
 * Optional String
 */
export const optionalStringSchema = z.string().optional().or(z.literal(''));

/**
 * Number Range
 */
export const numberRangeSchema = (min: number, max: number, fieldName: string) =>
  z
    .number()
    .min(min, `${fieldName} must be at least ${min}`)
    .max(max, `${fieldName} must not exceed ${max}`);

/**
 * Positive Number
 */
export const positiveNumberSchema = (fieldName: string) =>
  z.number().positive(`${fieldName} must be a positive number`);

/**
 * Date in Future
 */
export const futureDateSchema = (fieldName: string) =>
  z.date().refine((date) => date > new Date(), {
    message: `${fieldName} must be in the future`,
  });

/**
 * Date in Past
 */
export const pastDateSchema = (fieldName: string) =>
  z.date().refine((date) => date < new Date(), {
    message: `${fieldName} must be in the past`,
  });

/**
 * File Upload Validation
 */
export const fileSchema = (
  maxSizeMB: number = 5,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']
) =>
  z
    .instanceof(File)
    .refine((file) => file.size <= maxSizeMB * 1024 * 1024, {
      message: `File size must be less than ${maxSizeMB}MB`,
    })
    .refine((file) => allowedTypes.includes(file.type), {
      message: `File type must be one of: ${allowedTypes.join(', ')}`,
    });

/**
 * Checkbox (Terms & Conditions)
 */
export const checkboxSchema = (message: string = 'You must accept the terms and conditions') =>
  z.boolean().refine((val) => val === true, {
    message,
  });

/**
 * Confirm Password
 */
export const confirmPasswordSchema = () =>
  z.string().min(1, 'Please confirm your password');

/**
 * Helper to create password confirmation schema
 */
export const createPasswordConfirmation = () => ({
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema(),
});

/**
 * Validation Messages
 */
export const validationMessages = {
  required: (field: string) => `${field} is required`,
  email: 'Please enter a valid email address',
  password: {
    min: 'Password must be at least 8 characters',
    uppercase: 'Password must contain at least one uppercase letter',
    lowercase: 'Password must contain at least one lowercase letter',
    number: 'Password must contain at least one number',
    match: 'Passwords do not match',
  },
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  file: {
    size: (maxMB: number) => `File size must be less than ${maxMB}MB`,
    type: (types: string[]) => `File type must be one of: ${types.join(', ')}`,
  },
};
