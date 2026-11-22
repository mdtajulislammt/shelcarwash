import { digitsOnly } from '@/lib/format';
import type { BookingLookup } from '@/types';

export const CONTACT_ERROR = 'Enter a valid email or 10-digit phone number';

/** "Jane@Gmail.com" → { email: "jane@gmail.com" }, "(925) 555-0100" → { phone: "9255550100" }. */
export function parseContact(value: string): BookingLookup | null {
  const v = value.trim();
  if (v.includes('@')) return /^\S+@\S+\.\S+$/.test(v) ? { email: v.toLowerCase() } : null;
  const digits = digitsOnly(v);
  return digits.length >= 10 && digits.length <= 15 ? { phone: digits } : null;
}

/** "jane@gmail.com" → "j***@gmail.com", "9255550100" → "(***) ***-0100" */
export function maskContact(lookup: BookingLookup): string {
  if (lookup.email) {
    const [user, domain] = lookup.email.split('@');
    return `${user[0] ?? ''}***@${domain}`;
  }
  return `(***) ***-${(lookup.phone ?? '').slice(-4)}`;
}
