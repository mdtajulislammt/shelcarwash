import {
  authSessionSchema,
  contactSchema,
  requestCodeResponseSchema,
  type AuthSession,
  type RequestCodeResponse,
} from '@/features/auth/schemas';
import { maskContact } from '@/features/auth/utils/contact';
import { ApiError, apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { BookingLookup } from '@/types';
import { DEFAULT_LATENCY_MS, delay, generateId, type MockOptions } from './mock/mockDb';

/**
 * Passwordless sign-in: a one-time code by email/SMS, or Google (Google Identity Services ID
 * token verified by the backend).
 */
export interface AuthService {
  /** POST /api/auth/code */
  requestCode(contact: BookingLookup): Promise<RequestCodeResponse>;
  /** POST /api/auth/verify */
  verifyCode(contact: BookingLookup, code: string): Promise<AuthSession>;
  /** POST /api/auth/google — `credential` is the Google ID token (JWT). */
  signInWithGoogle(credential: string): Promise<AuthSession>;
}

const CODE_TTL_MS = 10 * 60 * 1000;

/** Reads the (unverified) payload of a JWT. Mock only — the backend must verify the signature. */
function decodeJwtPayload(jwt: string): Record<string, unknown> {
  const part = jwt.split('.')[1] ?? '';
  const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(json) as Record<string, unknown>;
}

export function createMockAuthService(opts: MockOptions = {}): AuthService {
  const latency = opts.latencyMs ?? DEFAULT_LATENCY_MS;
  const now = opts.now ?? (() => new Date());
  const codes = new Map<string, { code: string; expiresAt: number }>();
  const keyOf = (c: BookingLookup) => c.email ?? c.phone ?? '';

  return {
    async requestCode(contact) {
      await delay(latency);
      const c = contactSchema.parse(contact);
      const code = String(Math.floor(100000 + Math.random() * 900000));
      codes.set(keyOf(c), { code, expiresAt: now().getTime() + CODE_TTL_MS });
      return { sentTo: maskContact(c), devCode: code };
    },
    async verifyCode(contact, code) {
      await delay(latency);
      const c = contactSchema.parse(contact);
      const entry = codes.get(keyOf(c));
      if (!entry || entry.expiresAt < now().getTime()) {
        throw new ApiError('This code has expired. Request a new one.', 410, 'CODE_EXPIRED');
      }
      if (entry.code !== code.trim()) {
        throw new ApiError('Incorrect code. Please try again.', 401, 'INVALID_CODE');
      }
      codes.delete(keyOf(c));
      return { token: generateId('mock_session'), ...c };
    },
    async signInWithGoogle(credential) {
      await delay(latency);
      const payload = decodeJwtPayload(credential);
      const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
      if (!email) throw new ApiError('Google account has no email.', 401, 'INVALID_TOKEN');
      return { token: generateId('mock_session'), email };
    },
  };
}

export function createHttpAuthService(): AuthService {
  return {
    requestCode: (contact) =>
      apiClient.post(endpoints.authRequestCode, contact, { schema: requestCodeResponseSchema }),
    verifyCode: (contact, code) =>
      apiClient.post(endpoints.authVerifyCode, { ...contact, code }, { schema: authSessionSchema }),
    signInWithGoogle: (credential) =>
      apiClient.post(endpoints.authGoogle, { credential }, { schema: authSessionSchema }),
  };
}
