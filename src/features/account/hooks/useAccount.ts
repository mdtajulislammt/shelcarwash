import { useMemo } from 'react';
import { SITE } from '@/config/site';
import { useBookings } from '@/features/bookings/hooks/useBookings';
import { useLookupStore } from '@/features/bookings/store/lookupStore';
import { todayInBusinessTz } from '@/lib/dates';
import type { Customer } from '@/types';
import { formatServiceAddress, type AccountProfile } from '../utils/profile';
import { buildSchedule } from '../utils/schedule';
import { useAccountSettings, useManualEvents } from './useAccountData';

/**
 * The customer's account: bookings (by the signed-in / remembered contact), saved settings and
 * personal events. Backend phase: profile comes from GET /api/me.
 */
export function useAccount() {
  const lookup = useLookupStore((s) => s.lookup);
  const isVerified = useLookupStore((s) => !!s.token);
  const bookingsQuery = useBookings(lookup);
  const settingsQuery = useAccountSettings();
  const eventsQuery = useManualEvents();

  return useMemo(() => {
    const bookings = bookingsQuery.data ?? [];
    const settings = settingsQuery.data ?? null;
    const events = eventsQuery.data ?? [];
    const today = todayInBusinessTz();
    const upcoming = bookings
      .filter((b) => (b.status === 'confirmed' || b.status === 'in_progress') && b.date >= today)
      .sort((a, b) => `${a.date}${a.slotId}`.localeCompare(`${b.date}${b.slotId}`));

    const lastBooking: Customer | null = bookings[0]?.customer ?? null;
    const email = lookup?.email ?? lastBooking?.email ?? '';
    const hasAccount = !!lookup && (!!lastBooking || !!settings || isVerified);
    const profile: AccountProfile | null = hasAccount
      ? {
          fullName:
            settings?.fullName || lastBooking?.fullName || email.split('@')[0] || 'Customer',
          email,
          phone: settings?.phone || lastBooking?.phone || lookup?.phone || '',
        }
      : null;

    const lastMobile = bookings.find((b) => b.customer.serviceType === 'mobile')?.customer;
    const serviceAddress = settings?.streetAddress
      ? formatServiceAddress(settings)
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
  ]);
}
