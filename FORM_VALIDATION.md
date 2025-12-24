# World-Class Form Validation System

## 🎯 Overview

A comprehensive, reusable form validation system using **React Hook Form** + **Zod** for enterprise-grade form handling across your entire SaaS platform.

---

## ✨ Features

- ✅ **Type-Safe Validation** - Full TypeScript support with Zod schemas
- ✅ **Reusable Components** - FormField, FormSelect, FormCheckbox
- ✅ **Custom Hooks** - useFormValidation with error handling
- ✅ **Comprehensive Schemas** - Pre-built validation for auth, events, organizations
- ✅ **Error Logging** - Automatic error tracking and logging
- ✅ **Consistent UX** - Unified error display and validation behavior
- ✅ **Easy to Extend** - Add new validation rules and schemas easily

---

## 📚 Usage Examples

### 1. Basic Login Form

```typescript
import { useFormValidation, FormField } from '@/shared';
import { loginSchema, LoginFormData } from '@/shared/validation';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const form = useFormValidation({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: async (data: LoginFormData) => {
      // Handle login
      await authApi.login(data.email, data.password);
    },
  });

  return (
    <form onSubmit={form.handleSubmitWithValidation} className="space-y-4">
      <FormField
        form={form}
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        required
      />

      <FormField
        form={form}
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
      />

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
```

### 2. Register Form with Validation

```typescript
import { useFormValidation, FormField, FormCheckbox } from '@/shared';
import { registerSchema, RegisterFormData } from '@/shared/validation';

export function RegisterForm() {
  const form = useFormValidation({
    schema: registerSchema,
    onSubmit: async (data: RegisterFormData) => {
      await authApi.register(data.name, data.email, data.password);
    },
  });

  return (
    <form onSubmit={form.handleSubmitWithValidation} className="space-y-4">
      <FormField
        form={form}
        name="name"
        label="Full Name"
        placeholder="John Doe"
        required
      />

      <FormField
        form={form}
        name="email"
        label="Email"
        type="email"
        placeholder="john@example.com"
        required
      />

      <FormField
        form={form}
        name="password"
        label="Password"
        type="password"
        description="Must be at least 8 characters with uppercase, lowercase, and number"
        required
      />

      <FormField
        form={form}
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        required
      />

      <FormCheckbox
        form={form}
        name="acceptTerms"
        label="I accept the terms and conditions"
        required
      />

      <Button type="submit" disabled={form.formState.isSubmitting}>
        Create Account
      </Button>
    </form>
  );
}
```

### 3. Event Form with Select

```typescript
import { useFormValidation, FormField, FormSelect } from '@/shared';
import { eventSchema, EventFormData } from '@/shared/validation';

export function EventForm() {
  const form = useFormValidation({
    schema: eventSchema,
    onSubmit: async (data: EventFormData) => {
      await eventApi.create(data);
    },
  });

  const eventTypes = [
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'meetup', label: 'Meetup' },
  ];

  return (
    <form onSubmit={form.handleSubmitWithValidation} className="space-y-4">
      <FormField
        form={form}
        name="name"
        label="Event Name"
        required
      />

      <FormField
        form={form}
        name="description"
        label="Description"
        as="textarea"
        rows={4}
        required
      />

      <FormSelect
        form={form}
        name="event_type"
        label="Event Type"
        options={eventTypes}
        required
      />

      <FormField
        form={form}
        name="start_date"
        label="Start Date"
        type="datetime-local"
        required
      />

      <Button type="submit">Create Event</Button>
    </form>
  );
}
```

---

## 🔧 Available Validation Schemas

### Common Validation Rules

```typescript
import {
  emailSchema,
  passwordSchema,
  simplePasswordSchema,
  nameSchema,
  phoneSchema,
  urlSchema,
  requiredStringSchema,
  optionalStringSchema,
  numberRangeSchema,
  positiveNumberSchema,
  futureDateSchema,
  pastDateSchema,
  fileSchema,
  checkboxSchema,
} from '@/shared/validation';
```

### Auth Schemas

```typescript
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '@/shared/validation';
```

### Event Schemas

```typescript
import {
  eventSchema,
  quickEventSchema,
} from '@/shared/validation';
```

### Organization Schemas

```typescript
import {
  organizationSchema,
  quickOrganizationSchema,
} from '@/shared/validation';
```

---

## 🎨 Form Components

### FormField

```typescript
<FormField
  form={form}
  name="email"
  label="Email Address"
  type="email"
  placeholder="Enter email"
  required
  description="We'll never share your email"
/>
```

**Props:**
- `form` - React Hook Form instance
- `name` - Field name (type-safe)
- `label` - Field label
- `type` - Input type (text, email, password, etc.)
- `as` - 'input' or 'textarea'
- `placeholder` - Placeholder text
- `required` - Show required indicator
- `disabled` - Disable field
- `description` - Help text
- `className` - Custom CSS classes

### FormSelect

```typescript
<FormSelect
  form={form}
  name="country"
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
  required
/>
```

### FormCheckbox

```typescript
<FormCheckbox
  form={form}
  name="acceptTerms"
  label="I accept the terms and conditions"
  description="You must accept to continue"
  required
/>
```

---

## 🔨 Creating Custom Validation Schemas

### Example: Custom User Schema

```typescript
import { z } from 'zod';
import { emailSchema, nameSchema } from '@/shared/validation';

export const customUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  age: z.number()
    .min(18, 'Must be at least 18 years old')
    .max(120, 'Invalid age'),
  bio: z.string()
    .max(500, 'Bio must not exceed 500 characters')
    .optional(),
});

export type CustomUserFormData = z.infer<typeof customUserSchema>;
```

### Example: Conditional Validation

```typescript
export const conditionalSchema = z.object({
  hasCompany: z.boolean(),
  companyName: z.string().optional(),
}).refine((data) => {
  if (data.hasCompany) {
    return data.companyName && data.companyName.length > 0;
  }
  return true;
}, {
  message: 'Company name is required when you have a company',
  path: ['companyName'],
});
```

---

## 🚀 Advanced Features

### Error Handling

The `useFormValidation` hook automatically:
- Logs validation errors
- Logs submission errors
- Sets form-level errors
- Provides error context

### Form State

Access form state:

```typescript
const form = useFormValidation({ schema, onSubmit });

// Check if form is submitting
form.formState.isSubmitting

// Check if form is valid
form.formState.isValid

// Get form errors
form.formState.errors

// Check if form is dirty
form.formState.isDirty
```

### Manual Validation

```typescript
// Trigger validation for specific field
await form.trigger('email');

// Trigger validation for all fields
await form.trigger();

// Set custom error
form.setError('email', {
  type: 'manual',
  message: 'This email is already taken',
});
```

---

## 📋 Validation Rules Reference

### Email
- Required
- Valid email format
- Lowercase and trimmed

### Password (Strong)
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Password (Simple)
- Minimum 6 characters

### Name
- 2-50 characters
- Letters, spaces, hyphens, apostrophes only

### Phone
- International format
- Optional

### URL
- Valid URL format
- Optional

### File Upload
- Configurable max size (default 5MB)
- Configurable allowed types (default: JPEG, PNG, WebP)

---

## 🎯 Best Practices

1. **Always use TypeScript types** from schema inference
2. **Reuse common validation rules** instead of creating new ones
3. **Keep validation logic in schemas**, not in components
4. **Use descriptive error messages** for better UX
5. **Log errors** for debugging and monitoring
6. **Test validation** with edge cases

---

## 🔄 Migration Guide

### From Old Form to New Validation

**Before:**
```typescript
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const handleSubmit = () => {
  if (!email) {
    setError('Email is required');
    return;
  }
  // Submit...
};
```

**After:**
```typescript
const form = useFormValidation({
  schema: loginSchema,
  onSubmit: async (data) => {
    // Submit with validated data
  },
});

// Use FormField component
<FormField form={form} name="email" label="Email" required />
```

---

## ✅ Summary

Your form validation system is now:
- ✅ **World-Class** - Enterprise-grade validation
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Reusable** - Use across all forms
- ✅ **Consistent** - Unified UX and error handling
- ✅ **Extensible** - Easy to add new schemas
- ✅ **Production-Ready** - Error logging and monitoring

**All forms in your project can now use this system!** 🎉
