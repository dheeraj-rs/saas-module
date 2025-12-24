/**
 * Organization Form Validation Schemas
 * 
 * Zod schemas for organization-related forms
 */

import { z } from 'zod';
import {
  requiredStringSchema,
  optionalStringSchema,
  emailSchema,
  phoneSchema,
  urlSchema,
} from './common.validation';

/**
 * Organization Form Schema
 */
export const organizationSchema = z.object({
  name: requiredStringSchema('Organization name')
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must not exceed 100 characters'),
  
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  
  email: emailSchema,
  
  phone: phoneSchema,
  
  website: urlSchema,
  
  address: optionalStringSchema,
  
  city: optionalStringSchema,
  
  state: optionalStringSchema,
  
  country: optionalStringSchema,
  
  postal_code: optionalStringSchema,
  
  logo: urlSchema,
  
  industry: z.enum([
    'technology',
    'healthcare',
    'education',
    'finance',
    'retail',
    'manufacturing',
    'other',
  ]).optional(),
  
  size: z.enum([
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+',
  ]).optional(),
  
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

/**
 * Quick Organization Form Schema (Simplified)
 */
export const quickOrganizationSchema = z.object({
  name: requiredStringSchema('Organization name'),
  email: emailSchema,
});

export type QuickOrganizationFormData = z.infer<typeof quickOrganizationSchema>;
