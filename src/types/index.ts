/**
 * Shared domain types.
 *
 * Catalog types (Vehicle, Package, AddOn) are plain interfaces. Booking-related
 * types (Customer, Booking, CreateBookingRequest) are inferred from the zod
 * schemas in `features/booking/schemas.ts`, so the form validation, the mock
 * services and the API contract all share one source of truth.
 */

export const VEHICLE_CATEGORIES = ['sedan', 'suv', 'truck', 'exotic'] as const;
export type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number];

export const PACKAGE_CATEGORIES = [
  'exterior',
  'interior',
  'full',
  'ceramic',
  'maintenance',
] as const;
export type PackageCategory = (typeof PACKAGE_CATEGORIES)[number];

export const RECURRING_FREQUENCIES = ['weekly', 'bi-weekly', 'monthly'] as const;
export type RecurringFrequency = (typeof RECURRING_FREQUENCIES)[number];

export const SERVICE_TYPES = ['mobile', 'studio'] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number];

export const PAYMENT_METHODS = ['card', 'google_pay', 'zelle', 'venmo'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const BOOKING_STATUSES = ['confirmed', 'in_progress', 'completed', 'cancelled'] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export interface Vehicle {
  id: VehicleCategory;
  name: string;
  description: string;
  priceMultiplier: number;
  iconName: string;
}

export interface Package {
  id: string;
  name: string;
  tagline: string;
  description: string;
  durationMinutes: number;
  basePrice: number;
  popular?: boolean;
  features: string[];
  category: PackageCategory;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  icon: string;
}

export interface Catalog {
  vehicles: Vehicle[];
  packages: Package[];
  addOns: AddOn[];
}

export interface TimeSlot {
  /** Slot start in 24h "HH:mm" (America/Los_Angeles). Used as the slot id. */
  id: string;
  start: string;
  end: string;
  label: string;
  period: string;
}

export interface SlotAvailability extends TimeSlot {
  available: boolean;
}

export interface ServiceAreaResult {
  zip: string;
  serviceable: boolean;
  city: string | null;
}

export interface BookingLookup {
  email?: string;
  phone?: string;
}

export type {
  Customer,
  Booking,
  CreateBookingRequest,
  PaymentIntent,
  CreatePaymentIntentRequest,
} from '@/features/booking/schemas';
