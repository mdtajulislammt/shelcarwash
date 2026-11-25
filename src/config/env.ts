import { z } from 'zod';

const boolString = z
  .string()
  .trim()
  .toLowerCase()
  .optional()
  .transform((v) => (v === undefined || v === '' ? true : v === 'true'));

const envSchema = z
  .object({
    VITE_API_URL: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ?? '').replace(/\/+$/, ''))
      .refine((v) => v === '' || /^https?:\/\//.test(v), {
        message: 'VITE_API_URL must start with http:// or https://',
      }),
    VITE_USE_MOCK_API: boolString,
    VITE_STRIPE_PUBLISHABLE_KEY: z.string().trim().optional().default(''),
    VITE_GOOGLE_CLIENT_ID: z.string().trim().optional().default(''),
    VITE_GOOGLE_MAPS_API_KEY: z.string().trim().optional().default(''),
  })
  .refine((e) => e.VITE_USE_MOCK_API || e.VITE_API_URL !== '', {
    message: 'VITE_API_URL is required when VITE_USE_MOCK_API=false',
    path: ['VITE_API_URL'],
  });

export function parseEnv(raw: Record<string, unknown>) {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid environment configuration — ${issues}`);
  }
  return {
    apiUrl: result.data.VITE_API_URL,
    useMockApi: result.data.VITE_USE_MOCK_API,
    stripePublishableKey: result.data.VITE_STRIPE_PUBLISHABLE_KEY,
    googleClientId: result.data.VITE_GOOGLE_CLIENT_ID,
    googleMapsApiKey: result.data.VITE_GOOGLE_MAPS_API_KEY,
  };
}

export type AppEnv = ReturnType<typeof parseEnv>;

export const env: AppEnv = parseEnv(import.meta.env);
