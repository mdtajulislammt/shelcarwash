import type { Customer } from '@/features/booking/schemas';
import type { Profile } from './schemas';

/**
 * Profile to save after a booking: contact details from the booking; the address only from
 * mobile bookings (a studio drop-off keeps the previously saved address).
 */
export function profileFromCustomer(customer: Customer, previous: Profile | null): Profile {
  const address =
    customer.serviceType === 'mobile'
      ? customer
      : (previous ?? { streetAddress: '', city: '', state: 'CA', zipCode: '' });
  return {
    fullName: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    streetAddress: address.streetAddress,
    city: address.city,
    state: address.state || 'CA',
    zipCode: address.zipCode,
  };
}

/** Booking-form fields filled from a saved profile (address only if one is saved). */
export function customerPatchFromProfile(profile: Profile): Partial<Customer> {
  return {
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    ...(profile.streetAddress
      ? {
          streetAddress: profile.streetAddress,
          city: profile.city,
          state: profile.state,
          zipCode: profile.zipCode,
        }
      : {}),
  };
}

/** True while the booking form still shows exactly the saved profile's contact details. */
export function matchesProfile(customer: Customer, profile: Profile): boolean {
  const same = (a: string, b: string) => a.trim() === b.trim();
  const contact =
    !!customer.email &&
    same(customer.fullName, profile.fullName) &&
    same(customer.email, profile.email) &&
    same(customer.phone, profile.phone);
  if (!contact) return false;
  if (customer.serviceType !== 'mobile') return true;
  return (
    !!profile.streetAddress &&
    same(customer.streetAddress, profile.streetAddress) &&
    same(customer.city, profile.city) &&
    same(customer.zipCode, profile.zipCode)
  );
}

export function formatProfileAddress(profile: Profile): string {
  if (!profile.streetAddress) return '';
  return `${profile.streetAddress}, ${profile.city}, ${profile.state} ${profile.zipCode}`;
}
