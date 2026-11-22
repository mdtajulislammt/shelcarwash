import { useEffect, useRef } from 'react';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import { useAccount } from './useAccount';

/** Fills an empty booking form with the signed-in customer's contact and default address. */
export function usePrefillBookingContact() {
  const { profile, settings, isLoading } = useAccount();
  const patchCustomer = useBookingStore((s) => s.patchCustomer);
  const done = useRef(false);

  useEffect(() => {
    if (done.current || isLoading || !profile) return;
    done.current = true;
    const current = useBookingStore.getState().customer;
    if (current.fullName || current.email || current.phone) return;
    patchCustomer({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      ...(settings?.streetAddress
        ? { streetAddress: settings.streetAddress, city: settings.city, zipCode: settings.zipCode }
        : {}),
    });
  }, [isLoading, profile, settings, patchCustomer]);
}
