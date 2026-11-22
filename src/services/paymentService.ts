import { createPaymentIntentRequestSchema, paymentIntentSchema } from '@/features/booking/schemas';
import { ApiError, apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { CreatePaymentIntentRequest, PaymentIntent } from '@/types';
import {
  DEFAULT_LATENCY_MS,
  delay,
  generateId,
  readBookings,
  updateBooking,
  type MockOptions,
} from './mock/mockDb';

/**
 * POST /api/payments/intent — card & Google Pay only.
 * Zelle / Venmo are manual: the booking stays `paymentStatus: "pending"` until staff confirm.
 */
export interface PaymentService {
  createIntent(request: CreatePaymentIntentRequest): Promise<PaymentIntent>;
}

/**
 * DEMO ONLY: the mock "charges" instantly and marks the booking paid.
 * In the backend phase this becomes a Stripe PaymentIntent: the server returns a
 * client secret, the browser confirms it with Stripe.js / Payment Request (Google Pay),
 * and a Stripe webhook flips the booking to "paid".
 */
export function createMockPaymentService(opts: MockOptions = {}): PaymentService {
  const latency = opts.latencyMs ?? DEFAULT_LATENCY_MS * 2;
  return {
    async createIntent(request) {
      await delay(latency);
      const req = createPaymentIntentRequestSchema.parse(request);
      const booking = readBookings().find((b) => b.id === req.bookingId);
      if (!booking) throw new ApiError('Booking not found', 404, 'NOT_FOUND');
      const intentId = generateId('pi_mock');
      updateBooking(booking.id, { paymentStatus: 'paid', transactionId: intentId });
      return {
        id: intentId,
        bookingId: booking.id,
        amount: booking.totalPrice * 100,
        currency: 'usd',
        status: 'succeeded',
        clientSecret: null,
      };
    },
  };
}

export function createHttpPaymentService(): PaymentService {
  return {
    createIntent: (request) =>
      apiClient.post(endpoints.paymentIntent, request, { schema: paymentIntentSchema }),
  };
}
