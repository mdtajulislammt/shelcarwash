import { create } from 'zustand';
import { DEFAULT_PACKAGE_ID, PACKAGES } from '@/data/services';
import { getBookableDates } from '@/lib/dates';
import type { Customer, CustomerField } from '@/features/booking/schemas';
import type { RecurringFrequency, VehicleCategory } from '@/types';

/** Booking-flow state shared between "/" (service selection) and "/book". */

export const EMPTY_CUSTOMER: Customer = {
  fullName: '',
  email: '',
  phone: '',
  serviceType: 'mobile',
  streetAddress: '',
  city: '',
  state: 'CA',
  zipCode: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: '2024',
  vehicleColor: '',
  licensePlate: '',
  specialNotes: '',
};

interface BookingFlowState {
  vehicle: VehicleCategory;
  packageId: string;
  addonIds: string[];
  isRecurring: boolean;
  recurringFrequency: RecurringFrequency;
  date: string;
  slotId: string | null;
  customer: Customer;

  setVehicle: (vehicle: VehicleCategory) => void;
  selectPackage: (packageId: string) => void;
  toggleAddon: (addonId: string) => void;
  toggleRecurring: () => void;
  setRecurringFrequency: (frequency: RecurringFrequency) => void;
  setDate: (date: string) => void;
  setSlot: (slotId: string | null) => void;
  updateCustomer: (field: CustomerField, value: string) => void;
  patchCustomer: (patch: Partial<Customer>) => void;
  /** Clears schedule-specific state after a completed booking (keeps contact details). */
  resetAfterBooking: () => void;
}

const firstBookableDate = () => getBookableDates()[0].iso;
const isMaintenance = (packageId: string) =>
  PACKAGES.find((p) => p.id === packageId)?.category === 'maintenance';

export const useBookingStore = create<BookingFlowState>()((set) => ({
  vehicle: 'sedan',
  packageId: DEFAULT_PACKAGE_ID,
  addonIds: [],
  isRecurring: false,
  recurringFrequency: 'bi-weekly',
  date: firstBookableDate(),
  slotId: null,
  customer: EMPTY_CUSTOMER,

  setVehicle: (vehicle) => set({ vehicle }),
  selectPackage: (packageId) =>
    set((s) => ({ packageId, isRecurring: isMaintenance(packageId) ? s.isRecurring : false })),
  toggleAddon: (addonId) =>
    set((s) => ({
      addonIds: s.addonIds.includes(addonId)
        ? s.addonIds.filter((id) => id !== addonId)
        : [...s.addonIds, addonId],
    })),
  toggleRecurring: () => set((s) => ({ isRecurring: !s.isRecurring })),
  setRecurringFrequency: (recurringFrequency) => set({ recurringFrequency, isRecurring: true }),
  setDate: (date) => set({ date, slotId: null }),
  setSlot: (slotId) => set({ slotId }),
  updateCustomer: (field, value) => set((s) => ({ customer: { ...s.customer, [field]: value } })),
  patchCustomer: (patch) => set((s) => ({ customer: { ...s.customer, ...patch } })),
  resetAfterBooking: () =>
    set((s) => ({
      addonIds: [],
      date: firstBookableDate(),
      slotId: null,
      customer: {
        ...EMPTY_CUSTOMER,
        fullName: s.customer.fullName,
        email: s.customer.email,
        phone: s.customer.phone,
        serviceType: s.customer.serviceType,
        streetAddress: s.customer.streetAddress,
        city: s.customer.city,
        state: s.customer.state,
        zipCode: s.customer.zipCode,
      },
    })),
}));
