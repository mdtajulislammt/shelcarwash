import type { BookingLookup } from '@/types';

/** Central TanStack Query keys so invalidation stays consistent. */
export const queryKeys = {
  catalog: ['catalog'] as const,
  availability: (date: string) => ['availability', date] as const,
  availabilityAll: ['availability'] as const,
  bookings: (lookup: BookingLookup) =>
    ['bookings', lookup.email ?? '', lookup.phone ?? ''] as const,
  bookingsAll: ['bookings'] as const,
};
