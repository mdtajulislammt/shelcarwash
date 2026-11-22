import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/storage';
import type { BookingLookup } from '@/types';

interface LookupState {
  /** Contact used to look up "My Bookings" (remembered after booking on this device). */
  lookup: BookingLookup | null;
  setLookup: (lookup: BookingLookup) => void;
  clearLookup: () => void;
}

export const useLookupStore = create<LookupState>()(
  persist(
    (set) => ({
      lookup: null,
      setLookup: (lookup) => set({ lookup }),
      clearLookup: () => set({ lookup: null }),
    }),
    { name: STORAGE_KEYS.customerLookup, storage: createJSONStorage(() => localStorage) },
  ),
);
