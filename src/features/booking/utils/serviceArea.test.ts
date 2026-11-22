import { describe, expect, it } from 'vitest';
import { SERVICE_AREA_ZIPS } from '@/config/site';
import { customerSchema } from '../schemas';
import { checkServiceArea, isServiceableZip } from './serviceArea';

const ZIPS = [
  '94568',
  '94582',
  '94583',
  '94566',
  '94588',
  '94526',
  '94506',
  '94507',
  '94595',
  '94596',
  '94597',
  '94598',
];

describe('service area ZIP check', () => {
  it('accepts exactly the 12 service-area ZIPs', () => {
    expect(Object.keys(SERVICE_AREA_ZIPS).sort()).toEqual([...ZIPS].sort());
    ZIPS.forEach((z) => expect(isServiceableZip(z)).toBe(true));
  });

  it('rejects other or malformed ZIPs', () => {
    ['90001', '94550', '9456', '945688', 'abcde', ''].forEach((z) =>
      expect(isServiceableZip(z)).toBe(false),
    );
  });

  it('returns the city', () => {
    expect(checkServiceArea(' 94507 ')).toEqual({ zip: '94507', serviceable: true, city: 'Alamo' });
    expect(checkServiceArea('90001')).toEqual({ zip: '90001', serviceable: false, city: null });
  });

  it('blocks mobile bookings outside the area in the form schema', () => {
    const base = {
      fullName: 'Jane',
      email: 'jane@example.com',
      phone: '(925) 555-0100',
      serviceType: 'mobile' as const,
      streetAddress: '1 Main St',
      city: 'Dublin',
      zipCode: '90001',
      vehicleMake: 'BMW',
      vehicleModel: 'M4',
      vehicleYear: '2024',
      vehicleColor: '',
      licensePlate: '7XYZ89',
    };
    const bad = customerSchema.safeParse(base);
    expect(bad.success).toBe(false);
    expect(bad.error?.issues.map((i) => i.path[0])).toEqual(['zipCode']);
    expect(customerSchema.safeParse({ ...base, zipCode: '94568' }).success).toBe(true);
    // Studio drop-off does not need an address
    expect(
      customerSchema.safeParse({
        ...base,
        serviceType: 'studio',
        zipCode: '',
        city: '',
        streetAddress: '',
      }).success,
    ).toBe(true);
  });
});
