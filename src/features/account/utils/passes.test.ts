import { describe, expect, it } from 'vitest';
import type { Booking } from '@/types';
import { buildPasses } from './passes';

const base = {
  createdAt: '2026-11-01T00:00:00.000Z',
  service: {
    id: 'executive-full-detail',
    name: 'Apex Executive Full Detail',
    basePrice: 299,
    durationMinutes: 240,
    category: 'full',
  },
  vehicleCategory: 'sedan',
  addons: [],
  customer: {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '9255550100',
    serviceType: 'mobile',
    streetAddress: '1 Main St',
    city: 'Dublin',
    zipCode: '94568',
    vehicleMake: 'Porsche',
    vehicleModel: '911',
    vehicleYear: '2024',
    vehicleColor: 'Black',
    licensePlate: '7XYZ89',
    specialNotes: '',
  },
  slotId: '08:00',
  totalPrice: 299,
  estimatedDurationMinutes: 240,
  paymentMethod: 'card',
  isRecurring: false,
  recurringFrequency: null,
  transactionId: null,
  cancelledAt: null,
} as const;

const booking = (over: Partial<Booking>): Booking =>
  ({
    ...base,
    id: 'X',
    date: '2026-11-25',
    paymentStatus: 'paid',
    status: 'confirmed',
    ...over,
  }) as Booking;

describe('buildPasses', () => {
  const today = '2026-11-22';

  it('creates booking passes for upcoming bookings, soonest first', () => {
    const passes = buildPasses(
      [booking({ id: 'B', date: '2026-11-28', paymentStatus: 'pending' }), booking({ id: 'A' })],
      today,
    );
    expect(passes.map((p) => p.code)).toEqual(['PASS #A', 'PASS #B']);
    expect(passes[0].isNext).toBe(true);
    expect(passes[0].detail).toBe('Nov 25 • 8:00–11:00 AM');
    expect(passes[1].detail).toBe('Nov 28 • Pending Payment');
  });

  it('adds maintenance plans and service certificates, skips cancelled', () => {
    const passes = buildPasses(
      [
        booking({ id: 'R', isRecurring: true, recurringFrequency: 'monthly' }),
        booking({ id: 'C', date: '2026-11-10', status: 'completed' }),
        booking({ id: 'Z', status: 'cancelled' }),
      ],
      today,
    );
    expect(passes.map((p) => p.kind)).toEqual(['booking', 'plan', 'certificate']);
    expect(passes[1].detail).toBe('Monthly • Auto-scheduled');
    expect(passes[2].code).toBe('CERT #C');
  });
});
