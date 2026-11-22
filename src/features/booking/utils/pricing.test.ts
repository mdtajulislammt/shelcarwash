import { describe, expect, it } from 'vitest';
import { ADD_ONS, PACKAGES, VEHICLES } from '@/data/services';
import {
  calculatePackagePrice,
  calculateTotalDuration,
  calculateTotalPrice,
  formatMultiplier,
  getVehicleMultiplier,
} from './pricing';

const pkg = (id: string) => PACKAGES.find((p) => p.id === id)!;
const addOn = (id: string) => ADD_ONS.find((a) => a.id === id)!;

describe('pricing', () => {
  it('keeps the approved vehicle multipliers', () => {
    expect(VEHICLES.map((v) => [v.id, v.priceMultiplier])).toEqual([
      ['sedan', 1],
      ['suv', 1.2],
      ['truck', 1.4],
      ['exotic', 1.65],
    ]);
  });

  it('keeps the approved base prices', () => {
    expect(PACKAGES.map((p) => p.basePrice)).toEqual([50, 120, 150, 200, 299, 599, 999]);
    expect(ADD_ONS.map((a) => a.price)).toEqual([20, 20, 50, 50, 85]);
  });

  it('rounds base × multiplier', () => {
    expect(calculatePackagePrice(299, 1.65)).toBe(493); // 493.35
    expect(calculatePackagePrice(299, 1.2)).toBe(359); // 358.8
    expect(calculatePackagePrice(50, 1.65)).toBe(83); // 82.5 → 83
    expect(calculatePackagePrice(150, 1)).toBe(150);
  });

  it('adds add-ons after rounding the package price', () => {
    const total = calculateTotalPrice(
      pkg('executive-full-detail'),
      getVehicleMultiplier(VEHICLES, 'exotic'),
      [addOn('headlight-restoration'), addOn('ozone-odor-eliminator')],
    );
    expect(total).toBe(493 + 20 + 85);
  });

  it('falls back to 1× for an unknown vehicle', () => {
    expect(getVehicleMultiplier([], 'truck')).toBe(1);
  });

  it('sums durations', () => {
    expect(calculateTotalDuration(pkg('interior-deep-clean'), [addOn('pet-hair-removal')])).toBe(
      180,
    );
  });

  it('formats multipliers like the original UI', () => {
    expect(VEHICLES.map((v) => formatMultiplier(v.priceMultiplier))).toEqual([
      'Standard',
      '+20%',
      '+40%',
      '+65%',
    ]);
  });
});
