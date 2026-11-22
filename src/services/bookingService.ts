import { z } from 'zod';
import { CATALOG } from '@/data/services';
import { bookingSchema, createBookingRequestSchema } from '@/features/booking/schemas';
import {
  calculateTotalDuration,
  calculateTotalPrice,
  getVehicleMultiplier,
} from '@/features/booking/utils/pricing';
import { getCancelEligibility } from '@/features/bookings/utils/cancellation';
import { ApiError, apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { isBookableDate } from '@/lib/dates';
import { digitsOnly } from '@/lib/format';
import type { Booking, BookingLookup, CreateBookingRequest } from '@/types';
import {
  DEFAULT_LATENCY_MS,
  delay,
  generateId,
  isSlotTaken,
  readBookings,
  updateBooking,
  writeBookings,
  type MockOptions,
} from './mock/mockDb';

export interface BookingService {
  /** POST /api/bookings */
  create(request: CreateBookingRequest): Promise<Booking>;
  /** GET /api/bookings?phone=|email= */
  list(lookup: BookingLookup): Promise<Booking[]>;
  /** GET /api/bookings/:id */
  getById(id: string): Promise<Booking>;
  /** POST /api/bookings/:id/cancel — backend enforces the 24h rule. */
  cancel(id: string): Promise<Booking>;
}

function matchesLookup(b: Booking, lookup: BookingLookup): boolean {
  const email = lookup.email?.trim().toLowerCase();
  const phone = lookup.phone ? digitsOnly(lookup.phone) : '';
  if (!email && !phone) return false;
  return (
    (!!email && b.customer.email.toLowerCase() === email) ||
    (!!phone && digitsOnly(b.customer.phone) === phone)
  );
}

export function createMockBookingService(opts: MockOptions = {}): BookingService {
  const latency = opts.latencyMs ?? DEFAULT_LATENCY_MS;
  const now = opts.now ?? (() => new Date());

  return {
    async create(request) {
      await delay(latency);
      const parsed = createBookingRequestSchema.safeParse(request);
      if (!parsed.success) {
        throw new ApiError('Invalid booking request', 422, 'VALIDATION_ERROR', parsed.error.issues);
      }
      const req = parsed.data;
      const pkg = CATALOG.packages.find((p) => p.id === req.serviceId);
      if (!pkg) throw new ApiError('Unknown service package', 422, 'UNKNOWN_SERVICE');
      const addOns = CATALOG.addOns.filter((a) => req.addonIds.includes(a.id));
      if (!isBookableDate(req.date, now())) {
        throw new ApiError('That date is not bookable', 422, 'DATE_NOT_BOOKABLE');
      }
      const bookings = readBookings();
      if (isSlotTaken(bookings, req.date, req.slotId)) {
        throw new ApiError(
          'Sorry, that time slot was just booked. Please choose another.',
          409,
          'SLOT_UNAVAILABLE',
        );
      }
      const isRecurring = pkg.category === 'maintenance' && req.isRecurring;
      const booking: Booking = {
        id: generateId('CC'),
        createdAt: now().toISOString(),
        service: {
          id: pkg.id,
          name: pkg.name,
          basePrice: pkg.basePrice,
          durationMinutes: pkg.durationMinutes,
          category: pkg.category,
        },
        vehicleCategory: req.vehicleCategory,
        addons: addOns.map(({ id, name, price, durationMinutes }) => ({
          id,
          name,
          price,
          durationMinutes,
        })),
        customer: req.customer,
        date: req.date,
        slotId: req.slotId,
        totalPrice: calculateTotalPrice(
          pkg,
          getVehicleMultiplier(CATALOG.vehicles, req.vehicleCategory),
          addOns,
        ),
        estimatedDurationMinutes: calculateTotalDuration(pkg, addOns),
        paymentMethod: req.paymentMethod,
        // Every booking starts unpaid; card / Google Pay become "paid" via the payment intent.
        paymentStatus: 'pending',
        status: 'confirmed',
        isRecurring,
        recurringFrequency: isRecurring ? req.recurringFrequency : null,
        transactionId: null,
        cancelledAt: null,
      };
      writeBookings([booking, ...bookings]);
      return booking;
    },

    async list(lookup) {
      await delay(latency / 2);
      return readBookings()
        .filter((b) => matchesLookup(b, lookup))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },

    async getById(id) {
      await delay(latency / 2);
      const booking = readBookings().find((b) => b.id === id);
      if (!booking) throw new ApiError('Booking not found', 404, 'NOT_FOUND');
      return booking;
    },

    async cancel(id) {
      await delay(latency);
      const booking = readBookings().find((b) => b.id === id);
      if (!booking) throw new ApiError('Booking not found', 404, 'NOT_FOUND');
      const eligibility = getCancelEligibility(booking, now());
      if (!eligibility.allowed) {
        throw new ApiError(
          eligibility.reason ?? 'Cannot cancel',
          409,
          'CANCELLATION_WINDOW_CLOSED',
        );
      }
      return updateBooking(id, { status: 'cancelled', cancelledAt: now().toISOString() })!;
    },
  };
}

export function createHttpBookingService(): BookingService {
  return {
    create: (request) => apiClient.post(endpoints.bookings, request, { schema: bookingSchema }),
    list: (lookup) =>
      apiClient.get(endpoints.bookings, {
        query: { email: lookup.email, phone: lookup.phone },
        schema: z.array(bookingSchema),
      }),
    getById: (id) => apiClient.get(endpoints.booking(id), { schema: bookingSchema }),
    cancel: (id) =>
      apiClient.post(endpoints.cancelBooking(id), undefined, { schema: bookingSchema }),
  };
}
