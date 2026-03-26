import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const SecretaryOnboardSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().max(50).optional().or(z.literal('')),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { message: 'Gender is required' }),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    mobileNumber: z
      .string()
      .min(1, 'Phone number is required')
      .refine((val) => isValidPhoneNumber(val), { message: 'Invalid phone number' }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must be at most 32 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SecretaryOnboardValues = z.infer<typeof SecretaryOnboardSchema>;
