import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { bookingService } from '@/services';
import type { BookingLookup } from '@/types';

export function useBookings(lookup: BookingLookup | null) {
  const hasLookup = !!(lookup?.email || lookup?.phone);
  return useQuery({
    queryKey: queryKeys.bookings(lookup ?? {}),
    queryFn: () => bookingService.list(lookup ?? {}),
    enabled: hasLookup,
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingService.cancel(id),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookingsAll });
      void queryClient.invalidateQueries({ queryKey: queryKeys.availabilityAll });
    },
  });
}
