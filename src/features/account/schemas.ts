import { z } from 'zod';
import { SERVICE_AREA_CITIES, SERVICE_AREA_ERROR } from '@/config/site';
import { isServiceableZip } from '@/features/booking/utils/serviceArea';
import { digitsOnly } from '@/lib/format';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Profile settings (GET/PUT /api/me/settings). The address is the default mobile location. */
export const accountSettingsSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name'),
    phone: z
      .string()
      .trim()
      .refine((v) => digitsOnly(v).length >= 10, 'Enter a 10-digit phone number'),
    streetAddress: z.string().trim(),
    city: z.string().trim(),
    zipCode: z.string().trim(),
    smsReminders: z.boolean(),
    emailUpdates: z.boolean(),
  })
  .superRefine((s, ctx) => {
    const hasAddress = !!(s.streetAddress || s.city || s.zipCode);
    if (!hasAddress) return;
    if (!s.streetAddress) {
      ctx.addIssue({
        code: 'custom',
        path: ['streetAddress'],
        message: 'Street address is required',
      });
    }
    if (!(SERVICE_AREA_CITIES as readonly string[]).includes(s.city)) {
      ctx.addIssue({
        code: 'custom',
        path: ['city'],
        message: 'Select a city in our service area',
      });
    }
    if (!isServiceableZip(s.zipCode)) {
      ctx.addIssue({ code: 'custom', path: ['zipCode'], message: SERVICE_AREA_ERROR });
    }
  });

export const manualEventInputSchema = z
  .object({
    title: z.string().trim().min(2, 'Enter a title'),
    date: z.string().regex(ISO_DATE, 'Pick a date'),
    startTime: z.string().regex(HH_MM, 'Pick a start time'),
    endTime: z.string().regex(HH_MM, 'Pick an end time'),
    vehicle: z.string().trim(),
    location: z.string().trim(),
    notes: z.string().trim().max(500),
  })
  .refine((e) => e.endTime > e.startTime, {
    path: ['endTime'],
    message: 'End time must be after the start time',
  });

/** Personal calendar entry (GET/POST /api/me/events). Not a booking — no slot is reserved. */
export const manualEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string().regex(ISO_DATE),
  startTime: z.string().regex(HH_MM),
  endTime: z.string().regex(HH_MM),
  vehicle: z.string(),
  location: z.string(),
  notes: z.string(),
  createdAt: z.string(),
});

export const walletSaveLinkSchema = z.object({
  /** https://pay.google.com/gp/v/save/<signed JWT>, or null when unavailable (mock mode). */
  saveUrl: z.string().url().nullable(),
});

export type AccountSettings = z.infer<typeof accountSettingsSchema>;
export type ManualEventInput = z.infer<typeof manualEventInputSchema>;
export type ManualEvent = z.infer<typeof manualEventSchema>;
export type WalletSaveLink = z.infer<typeof walletSaveLinkSchema>;
