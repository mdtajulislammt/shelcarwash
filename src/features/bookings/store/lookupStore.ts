import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { setAuthTokenProvider } from '@/lib/api/client';
import { STORAGE_KEYS } from '@/lib/storage';
import type { BookingLookup } from '@/types';

interface LookupState {
  /** Customer contact for "My Bookings" / account (signed in, or remembered after checkout). */
  lookup: BookingLookup | null;
  /** Session token from a verified sign-in (email/SMS code or Google). Sent as Bearer token. */
  token: string | null;
  /** Remember the contact used at checkout on this device. */
  setLookup: (lookup: BookingLookup) => void;
  /** Verified sign-in. */
  setSession: (lookup: BookingLookup, token: string) => void;
  clearLookup: () => void;
}

export const useLookupStore = create<LookupState>()(
  persist(
    (set) => ({
      lookup: null,
      token: null,
      setLookup: (lookup) => set({ lookup }),
      setSession: (lookup, token) => set({ lookup, token }),
      clearLookup: () => set({ lookup: null, token: null }),
    }),
    { name: STORAGE_KEYS.customerLookup, storage: createJSONStorage(() => localStorage) },
  ),
);

setAuthTokenProvider(() => useLookupStore.getState().token);

/** Stable key for per-customer data ("email" or phone digits). */
export function contactKey(lookup: BookingLookup | null): string {
  return lookup?.email ?? lookup?.phone ?? '';
}
