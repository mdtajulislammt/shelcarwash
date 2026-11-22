import { z } from 'zod';
import { SERVICE_AREA_CITIES, SERVICE_AREA_ERROR, TIME_SLOTS } from '@/config/site';
import { digitsOnly } from '@/lib/format';
import {
  BOOKING_STATUSES,
  PACKAGE_CATEGORIES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  RECURRING_FREQUENCIES,
  SERVICE_TYPES,
  VEHICLE_CATEGORIES,
} from '@/types';
import { isServiceableZip } from './utils/serviceArea';

/**
 * Single source of truth for booking data: used by the booking form, the mock
 * services and the HTTP services (response validation). Mirrors docs/API_CONTRACT.md.
 */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');
const slotIds = TIME_SLOTS.map((s) => s.id) as [string, ...string[]];

export const customerSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Full name is required'),
    email: z.string().trim().email('Valid email is required for booking confirmation'),
    phone: z
      .string()
      .trim()
      .min(1, 'Phone number is required')
      .refine((v) => digitsOnly(v).length >= 10, 'Enter a valid 10-digit phone number'),
    serviceType: z.enum(SERVICE_TYPES),
    streetAddress: z.string().trim(),
    city: z.string().trim(),
    zipCode: z.string().trim(),
    vehicleMake: z.string().trim().min(1, 'Make is required'),
    vehicleModel: z.string().trim().min(1, 'Model is required'),
    vehicleYear: z.string().trim(),
    vehicleColor: z.string().trim(),
    licensePlate: z.string().trim().min(1, 'License plate is required'),
    specialNotes: z.string().trim().optional(),
  })
  .superRefine((c, ctx) => {
    if (c.serviceType !== 'mobile') return;
    if (!c.streetAddress) {
      ctx.addIssue({
        code: 'custom',
        path: ['streetAddress'],
        message: 'Address is required for mobile detailing',
      });
    }
    if (!(SERVICE_AREA_CITIES as readonly string[]).includes(c.city)) {
      ctx.addIssue({
        code: 'custom',
        path: ['city'],
        message: 'Select a city in our service area',
      });
    }
    if (!c.zipCode) {
      ctx.addIssue({ code: 'custom', path: ['zipCode'], message: 'ZIP code is required' });
    } else if (!isServiceableZip(c.zipCode)) {
      ctx.addIssue({ code: 'custom', path: ['zipCode'], message: SERVICE_AREA_ERROR });
    }
  });

export type Customer = z.infer<typeof customerSchema>;
export type CustomerField = keyof Customer;

export const createBookingRequestSchema = z.object({
  serviceId: z.string().min(1),
  vehicleCategory: z.enum(VEHICLE_CATEGORIES),
  addonIds: z.array(z.string()),
  date: isoDate,
  slotId: z.enum(slotIds),
  customer: customerSchema,
  paymentMethod: z.enum(PAYMENT_METHODS),
  isRecurring: z.boolean(),
  recurringFrequency: z.enum(RECURRING_FREQUENCIES).nullable(),
});

export type CreateBookingRequest = z.infer<typeof createBookingRequestSchema>;

export const bookingSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  service: z.object({
    id: z.string(),
    name: z.string(),
    basePrice: z.number(),
    durationMinutes: z.number(),
    category: z.enum(PACKAGE_CATEGORIES),
  }),
  vehicleCategory: z.enum(VEHICLE_CATEGORIES),
  addons: z.array(
    z.object({ id: z.string(), name: z.string(), price: z.number(), durationMinutes: z.number() }),
  ),
  customer: customerSchema,
  date: isoDate,
  slotId: z.string(),
  totalPrice: z.number(),
  estimatedDurationMinutes: z.number(),
  paymentMethod: z.enum(PAYMENT_METHODS),
  paymentStatus: z.enum(PAYMENT_STATUSES),
  status: z.enum(BOOKING_STATUSES),
  isRecurring: z.boolean(),
  recurringFrequency: z.enum(RECURRING_FREQUENCIES).nullable(),
  transactionId: z.string().nullable(),
  cancelledAt: z.string().nullable(),
});

export type Booking = z.infer<typeof bookingSchema>;

export const createPaymentIntentRequestSchema = z.object({
  bookingId: z.string(),
  method: z.enum(['card', 'google_pay']),
});

export type CreatePaymentIntentRequest = z.infer<typeof createPaymentIntentRequestSchema>;

export const paymentIntentSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  amount: z.number(),
  currency: z.literal('usd'),
  status: z.enum(['requires_payment_method', 'requires_confirmation', 'processing', 'succeeded']),
  /** Stripe client secret — null in mock mode. */
  clientSecret: z.string().nullable(),
});

export type PaymentIntent = z.infer<typeof paymentIntentSchema>;

/** Turns zod issues into a `{ field: message }` map for the form (first message per field). */
export function toFieldErrors<K extends string = CustomerField>(
  error: z.ZodError,
): Partial<Record<K, string>> {
  const out: Partial<Record<K, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[issue.path.length - 1] as K;
    if (field && !out[field]) out[field] = issue.message;
  }
  return out;
}
