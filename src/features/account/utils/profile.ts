import type { Customer } from '@/types';

/** "Mac Millins" → "MM" */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
  return (first + last).toUpperCase();
}

/** "Mac Millins" → "Mac" */
export function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? '';
}

export function formatServiceAddress(
  customer: Pick<Customer, 'streetAddress' | 'city' | 'zipCode'>,
): string {
  return [customer.streetAddress, customer.city, `CA ${customer.zipCode}`]
    .map((part) => part.trim())
    .filter((part) => part && part !== 'CA')
    .join(', ');
}

export function formatVehicle(customer: Customer): string {
  return [customer.vehicleYear, customer.vehicleMake, customer.vehicleModel]
    .filter(Boolean)
    .join(' ');
}

/** What the account pages show about the customer. */
export interface AccountProfile {
  fullName: string;
  email: string;
  phone: string;
  /** False when fullName is only a fallback (email prefix / "Customer"), not a name the customer gave. */
  hasName: boolean;
}
