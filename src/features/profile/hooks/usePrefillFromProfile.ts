import { useEffect, useRef } from 'react';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import { customerPatchFromProfile } from '../utils';
import { useProfile } from './useProfile';

/** Fills an empty booking form once from the saved profile. Returns the profile (or null). */
export function usePrefillFromProfile() {
  const { data: profile = null } = useProfile();
  const patchCustomer = useBookingStore((s) => s.patchCustomer);
  const done = useRef(false);

  useEffect(() => {
    if (done.current || !profile) return;
    done.current = true;
    const current = useBookingStore.getState().customer;
    if (current.fullName || current.email || current.phone) return;
    patchCustomer(customerPatchFromProfile(profile));
  }, [profile, patchCustomer]);

  return profile;
}
