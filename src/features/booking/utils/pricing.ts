import type { AddOn, Package, Vehicle, VehicleCategory } from '@/types';

type PricedAddOn = Pick<AddOn, 'price'>;
type TimedAddOn = Pick<AddOn, 'durationMinutes'>;

/** Multiplier for a vehicle category; falls back to 1 for unknown categories. */
export function getVehicleMultiplier(
  vehicles: readonly Vehicle[],
  category: VehicleCategory,
): number {
  return vehicles.find((v) => v.id === category)?.priceMultiplier ?? 1;
}

/** Package price for a vehicle: Math.round(base × multiplier). */
export function calculatePackagePrice(basePrice: number, multiplier: number): number {
  return Math.round(basePrice * multiplier);
}

/** Total = Math.round(base × vehicle multiplier) + sum of add-on prices. */
export function calculateTotalPrice(
  pkg: Pick<Package, 'basePrice'>,
  multiplier: number,
  addOns: readonly PricedAddOn[],
): number {
  const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);
  return calculatePackagePrice(pkg.basePrice, multiplier) + addOnsTotal;
}

export function calculateTotalDuration(
  pkg: Pick<Package, 'durationMinutes'>,
  addOns: readonly TimedAddOn[],
): number {
  return pkg.durationMinutes + addOns.reduce((sum, a) => sum + a.durationMinutes, 0);
}

/** "Standard" for 1×, otherwise "+20%" etc. */
export function formatMultiplier(multiplier: number): string {
  return multiplier === 1 ? 'Standard' : `+${Math.round((multiplier - 1) * 100)}%`;
}
