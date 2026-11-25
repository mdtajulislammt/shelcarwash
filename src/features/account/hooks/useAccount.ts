import { useMemo } from 'react';
import { SITE } from '@/config/site';
import { useBookings } from '@/features/bookings/hooks/useBookings';
import { useLookupStore } from '@/features/bookings/store/lookupStore';
import { useProfile } from '@/features/profile/hooks/useProfile';
import type { Profile } from '@/features/profile/schemas';
import { formatProfileAddress } from '@/features/profile/utils';
import { todayInBusinessTz } from '@/lib/dates';
import { digitsOnly } from '@/lib/format';
import type { BookingLookup } from '@/types';
import type { Customer } from '@/types';
import { formatServiceAddress, type AccountProfile } from '../utils/profile';
import { buildSchedule } from '../utils/schedule';
import { useAccountSettings, useManualEvents } from './useAccountData';

/** The device profile belongs to this customer (same email or phone). */
function profileMatches(profile: Profile | null, lookup: BookingLookup | null): profile is Profile {
  if (!profile || !lookup) return false;
  if (lookup.email) return profile.email.toLowerCase() === lookup.email.toLowerCase();
  return !!lookup.phone && digitsOnly(profile.phone) === digitsOnly(lookup.phone);
}

/**
 * The customer's account: bookings (by the signed-in / remembered contact), saved settings and
 * personal events, plus the saved profile (features/profile) when it belongs to this contact.
 */
export function useAccount() {
  const lookup = useLookupStore((s) => s.lookup);
  const isVerified = useLookupStore((s) => !!s.token);
  const bookingsQuery = useBookings(lookup);
  const settingsQuery = useAccountSettings();
  const eventsQuery = useManualEvents();
  const profileQuery = useProfile();

  return useMemo(() => {
    const bookings = bookingsQuery.data ?? [];
    const settings = settingsQuery.data ?? null;
    const saved = profileMatches(profileQuery.data ?? null, lookup) ? profileQuery.data : null;
    const events = eventsQuery.data ?? [];
    const today = todayInBusinessTz();
    const upcoming = bookings
      .filter((b) => (b.status === 'confirmed' || b.status === 'in_progress') && b.date >= today)
      .sort((a, b) => `${a.date}${a.slotId}`.localeCompare(`${b.date}${b.slotId}`));

    const lastBooking: Customer | null = bookings[0]?.customer ?? null;
    const email = lookup?.email ?? lastBooking?.email ?? '';
    const hasAccount = !!lookup && (!!lastBooking || !!saved || isVerified);
    const givenName = saved?.fullName || lastBooking?.fullName || '';
    const profile: AccountProfile | null = hasAccount
      ? {
          fullName: givenName || email.split('@')[0] || 'Customer',
          hasName: !!givenName,
          email,
          phone: saved?.phone || lastBooking?.phone || lookup?.phone || '',
        }
      : null;

    const lastMobile = bookings.find((b) => b.customer.serviceType === 'mobile')?.customer;
    const serviceAddress = saved?.streetAddress
      ? formatProfileAddress(saved)
      : lastMobile
        ? formatServiceAddress(lastMobile)
        : null;

    return {
      lookup,
      isVerified,
      bookings,
      upcoming,
      events,
      schedule: buildSchedule(upcoming, events, today, SITE.studioAddress),
      settings,
      savedProfile: saved ?? null,
      profile,
      serviceAddress,
      isLoading: !!lookup && (bookingsQuery.isLoading || settingsQuery.isLoading),
      error: bookingsQuery.error ?? settingsQuery.error ?? eventsQuery.error,
    };
  }, [
    lookup,
    isVerified,
    bookingsQuery.data,
    bookingsQuery.isLoading,
    bookingsQuery.error,
    settingsQuery.data,
    settingsQuery.isLoading,
    settingsQuery.error,
    eventsQuery.data,
    eventsQuery.error,
    profileQuery.data,
  ]);
}
