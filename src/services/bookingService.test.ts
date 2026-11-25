import { describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from '@/lib/storage';
import type { CreateBookingRequest } from '@/types';
import { createMockAvailabilityService } from './availabilityService';
import { createMockBookingService } from './bookingService';
import { createMockPaymentService } from './paymentService';

// "Now" = Nov 22 2026, 10:00 LA → bookable dates are Nov 23 … Dec 6
const now = () => new Date('2026-11-22T18:00:00Z');
const opts = { latencyMs: 0, now };
const bookings = createMockBookingService(opts);
const availability = createMockAvailabilityService(opts);
const payments = createMockPaymentService(opts);

const request = (over: Partial<CreateBookingRequest> = {}): CreateBookingRequest => ({
  serviceId: 'executive-full-detail',
  vehicleCategory: 'exotic',
  addonIds: ['headlight-restoration'],
  date: '2026-11-25',
  slotId: '11:00',
  paymentMethod: 'zelle',
  isRecurring: false,
  recurringFrequency: null,
  customer: {
    fullName: 'Jane Doe',
    email: 'Jane@Example.com',
    phone: '(925) 555-0100',
    serviceType: 'mobile',
    streetAddress: '1 Main St',
    city: 'Dublin',
    state: 'CA',
    zipCode: '94568',
    vehicleMake: 'Porsche',
    vehicleModel: '911',
    vehicleYear: '2024',
    vehicleColor: 'Black',
    licensePlate: '7XYZ89',
  },
  ...over,
});

describe('mock booking service', () => {
  it('creates a booking with server-side price and pending payment', async () => {
    const b = await bookings.create(request());
    expect(b.id).toMatch(/^CC-/);
    expect(b.status).toBe('confirmed');
    expect(b.paymentStatus).toBe('pending');
    expect(b.totalPrice).toBe(Math.round(299 * 1.65) + 20);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.bookings)!)).toHaveLength(1);
  });

  it('marks card bookings paid through the payment intent', async () => {
    const b = await bookings.create(request({ paymentMethod: 'card' }));
    const intent = await payments.createIntent({ bookingId: b.id, method: 'card' });
    expect(intent.status).toBe('succeeded');
    const updated = await bookings.getById(b.id);
    expect(updated.paymentStatus).toBe('paid');
    expect(updated.transactionId).toBe(intent.id);
  });

  it('marks booked slots unavailable and rejects double booking', async () => {
    await bookings.create(request());
    const slots = await availability.getAvailability('2026-11-25');
    expect(slots.map((s) => [s.id, s.available])).toEqual([
      ['08:00', true],
      ['11:00', false],
      ['14:00', true],
    ]);
    await expect(bookings.create(request())).rejects.toMatchObject({ status: 409 });
  });

  it('rejects dates outside the bookable window and out-of-area ZIPs', async () => {
    await expect(bookings.create(request({ date: '2026-11-22' }))).rejects.toMatchObject({
      status: 422,
    });
    const r = request();
    await expect(
      bookings.create({ ...r, customer: { ...r.customer, zipCode: '90001' } }),
    ).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
  });

  it('lists bookings by email or phone only', async () => {
    await bookings.create(request());
    expect(await bookings.list({ email: 'jane@example.com' })).toHaveLength(1);
    expect(await bookings.list({ phone: '9255550100' })).toHaveLength(1);
    expect(await bookings.list({ email: 'other@example.com' })).toHaveLength(0);
    expect(await bookings.list({})).toHaveLength(0);
  });

  it('enforces the 24h cancellation rule', async () => {
    const far = await bookings.create(request({ date: '2026-11-25' }));
    const cancelled = await bookings.cancel(far.id);
    expect(cancelled.status).toBe('cancelled');
    // slot frees up again
    const slots = await availability.getAvailability('2026-11-25');
    expect(slots.find((s) => s.id === '11:00')?.available).toBe(true);

    // Nov 23 08:00 LA is 22h away from "now"
    const soon = await bookings.create(request({ date: '2026-11-23', slotId: '08:00' }));
    await expect(bookings.cancel(soon.id)).rejects.toMatchObject({
      status: 409,
      code: 'CANCELLATION_WINDOW_CLOSED',
    });
  });

  it('keeps recurring only for maintenance packages', async () => {
    const b = await bookings.create(
      request({ isRecurring: true, recurringFrequency: 'weekly', slotId: '14:00' }),
    );
    expect(b.isRecurring).toBe(false);
    const m = await bookings.create(
      request({
        serviceId: 'maintenance-clean',
        isRecurring: true,
        recurringFrequency: 'weekly',
        slotId: '08:00',
      }),
    );
    expect(m.isRecurring).toBe(true);
    expect(m.recurringFrequency).toBe('weekly');
  });
});
