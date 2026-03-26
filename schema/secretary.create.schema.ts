import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const SecretaryCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().max(50).optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { message: 'Gender is required' }),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  mobileNumber: z
    .string()
    .min(1, 'Phone number is required')
    .refine((val) => isValidPhoneNumber(val), { message: 'Invalid phone number' }),
});

export type SecretaryCreateValues = z.infer<typeof SecretaryCreateSchema>;
