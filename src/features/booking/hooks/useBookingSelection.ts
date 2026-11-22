import { useMemo } from 'react';
import { useBookingStore } from '../store/bookingStore';
import {
  calculateTotalDuration,
  calculateTotalPrice,
  getVehicleMultiplier,
} from '../utils/pricing';
import { useCatalog } from './useCatalog';

export const FREQUENCY_OPTIONS = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'bi-weekly', label: 'Bi-Weekly' },
  { id: 'monthly', label: 'Monthly' },
] as const;

/** Resolved selection (package / add-on objects) + derived price, duration and recurring info. */
export function useBookingSelection() {
  const catalog = useCatalog();
  const vehicle = useBookingStore((s) => s.vehicle);
  const packageId = useBookingStore((s) => s.packageId);
  const addonIds = useBookingStore((s) => s.addonIds);
  const isRecurringRaw = useBookingStore((s) => s.isRecurring);
  const recurringFrequency = useBookingStore((s) => s.recurringFrequency);

  return useMemo(() => {
    const selectedPackage = catalog.packages.find((p) => p.id === packageId) ?? catalog.packages[0];
    const selectedAddOns = catalog.addOns.filter((a) => addonIds.includes(a.id));
    const multiplier = getVehicleMultiplier(catalog.vehicles, vehicle);
    const isMaintenancePlan = selectedPackage.category === 'maintenance';
    const isRecurring = isMaintenancePlan && isRecurringRaw;
    return {
      catalog,
      vehicle,
      multiplier,
      selectedPackage,
      selectedAddOns,
      isMaintenancePlan,
      isRecurring,
      recurringFrequency,
      frequencyLabel:
        FREQUENCY_OPTIONS.find((f) => f.id === recurringFrequency)?.label ?? 'Bi-Weekly',
      totalPrice: calculateTotalPrice(selectedPackage, multiplier, selectedAddOns),
      totalDuration: calculateTotalDuration(selectedPackage, selectedAddOns),
    };
  }, [catalog, vehicle, packageId, addonIds, isRecurringRaw, recurringFrequency]);
}
