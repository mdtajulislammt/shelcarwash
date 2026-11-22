import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLookupStore } from '@/features/bookings/store/lookupStore';
import { queryKeys } from '@/lib/api/queryKeys';
import { bookingService, paymentService } from '@/services';
import type { Booking, CreateBookingRequest } from '@/types';

/**
 * Creates the booking, then — for card / Google Pay — creates a payment intent.
 * Demo: the mock intent succeeds instantly. Backend phase: confirm the Stripe
 * client secret here with Stripe.js before re-fetching the booking.
 * Zelle / Venmo bookings stay `paymentStatus: "pending"`.
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();
  const remember = useLookupStore((s) => s.setLookup);

  return useMutation({
    mutationFn: async (request: CreateBookingRequest): Promise<Booking> => {
      const booking = await bookingService.create(request);
      if (request.paymentMethod === 'card' || request.paymentMethod === 'google_pay') {
        await paymentService.createIntent({ bookingId: booking.id, method: request.paymentMethod });
        return bookingService.getById(booking.id);
      }
      return booking;
    },
    onSuccess: (booking) => {
      remember({ email: booking.customer.email, phone: booking.customer.phone });
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookingsAll });
      void queryClient.invalidateQueries({ queryKey: queryKeys.availabilityAll });
    },
    onError: () => {
      // A slot may have been taken meanwhile — refresh availability.
      void queryClient.invalidateQueries({ queryKey: queryKeys.availabilityAll });
    },
  });
}
