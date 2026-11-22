import { z } from 'zod';

export const contactSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z
      .string()
      .regex(/^\d{10,15}$/)
      .optional(),
  })
  .refine((c) => !!(c.email || c.phone), { message: 'Email or phone is required' });

/** POST /api/auth/code → where the one-time code was sent. */
export const requestCodeResponseSchema = z.object({
  sentTo: z.string(),
  /** Mock mode only: the code, shown on screen because nothing is actually sent. */
  devCode: z.string().optional(),
});

/** POST /api/auth/verify and POST /api/auth/google → session. */
export const authSessionSchema = z.object({
  token: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export type RequestCodeResponse = z.infer<typeof requestCodeResponseSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
