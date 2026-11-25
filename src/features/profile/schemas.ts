import { z } from 'zod';
import { addServiceAddressIssues } from '@/features/booking/schemas';
import { digitsOnly } from '@/lib/format';

/**
 * Customer profile saved on this device (and on the account once signed in). Used to pre-fill
 * the next booking. The address is optional, but when given it must be in the service area.
 */
export const profileSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name'),
    email: z
      .string()
      .trim()
      .refine((v) => v === '' || z.string().email().safeParse(v).success, 'Enter a valid email'),
    phone: z
      .string()
      .trim()
      .refine((v) => digitsOnly(v).length >= 10, 'Enter a valid 10-digit phone number'),
    streetAddress: z.string().trim(),
    city: z.string().trim(),
    state: z.string().trim().toUpperCase(),
    zipCode: z.string().trim(),
  })
  .superRefine((p, ctx) => {
    if (p.streetAddress || p.city || p.zipCode) addServiceAddressIssues(p, ctx);
  });

export type Profile = z.infer<typeof profileSchema>;
export type ProfileField = keyof Profile;

export const EMPTY_PROFILE: Profile = {
  fullName: '',
  email: '',
  phone: '',
  streetAddress: '',
  city: '',
  state: 'CA',
  zipCode: '',
};
