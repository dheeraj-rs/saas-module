/**
 * Event Form Validation Schemas
 * 
 * Zod schemas for event-related forms
 */

import { z } from 'zod';
import {
  requiredStringSchema,
  optionalStringSchema,
  urlSchema,
  futureDateSchema,
  positiveNumberSchema,
} from './common.validation';

/**
 * Event Form Schema
 */
export const eventSchema = z.object({
  name: requiredStringSchema('Event name')
    .min(3, 'Event name must be at least 3 characters')
    .max(100, 'Event name must not exceed 100 characters'),
  
  description: requiredStringSchema('Description')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  
  organization_id: requiredStringSchema('Organization'),
  
  start_date: z.string().min(1, 'Start date is required'),
  
  end_date: z.string().min(1, 'End date is required'),
  
  location: requiredStringSchema('Location')
    .min(3, 'Location must be at least 3 characters'),
  
  venue: optionalStringSchema,
  
  max_attendees: z
    .number()
    .positive('Maximum attendees must be a positive number')
    .int('Maximum attendees must be a whole number')
    .optional(),
  
  registration_deadline: z.string().optional(),
  
  event_type: z.enum(['conference', 'workshop', 'seminar', 'webinar', 'meetup', 'other'], {
    errorMap: () => ({ message: 'Please select a valid event type' }),
  }),
  
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).default('draft'),
  
  is_public: z.boolean().default(true),
  
  registration_required: z.boolean().default(true),
  
  website_url: urlSchema,
  
  image_url: urlSchema,
  
  tags: z.array(z.string()).optional(),
}).refine((data) => new Date(data.end_date) > new Date(data.start_date), {
  message: 'End date must be after start date',
  path: ['end_date'],
});

export type EventFormData = z.infer<typeof eventSchema>;

/**
 * Quick Event Form Schema (Simplified)
 */
export const quickEventSchema = z.object({
  name: requiredStringSchema('Event name'),
  organization_id: requiredStringSchema('Organization'),
  start_date: z.string().min(1, 'Start date is required'),
  location: requiredStringSchema('Location'),
  event_type: z.enum(['conference', 'workshop', 'seminar', 'webinar', 'meetup', 'other']),
});

export type QuickEventFormData = z.infer<typeof quickEventSchema>;
