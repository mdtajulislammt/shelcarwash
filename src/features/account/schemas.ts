import { z } from 'zod';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Notification preferences (GET/PUT /api/me/settings). Name, phone and address live in the
 * customer profile (features/profile).
 */
export const accountSettingsSchema = z.object({
  smsReminders: z.boolean(),
  emailUpdates: z.boolean(),
});

export const DEFAULT_ACCOUNT_SETTINGS: AccountSettings = { smsReminders: true, emailUpdates: true };

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

export type AccountSettings = z.infer<typeof accountSettingsSchema>;
export type ManualEventInput = z.infer<typeof manualEventInputSchema>;
export type ManualEvent = z.infer<typeof manualEventSchema>;
