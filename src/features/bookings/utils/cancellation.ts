import { CANCELLATION_POLICY } from '@/config/site';
import { hoursUntil } from '@/lib/dates';
import type { Booking } from '@/types';

export interface CancelEligibility {
  allowed: boolean;
  reason: string | null;
}

/**
 * Cancellation is allowed until 24h before the appointment start (LA time).
 * The backend enforces the same rule; this is for UI state only.
 */
export function getCancelEligibility(
  booking: Pick<Booking, 'date' | 'slotId' | 'status'>,
  now: Date = new Date(),
): CancelEligibility {
  if (booking.status === 'cancelled') return { allowed: false, reason: 'Already cancelled' };
  if (booking.status === 'completed' || booking.status === 'in_progress') {
    return { allowed: false, reason: 'Service already started' };
  }
  if (hoursUntil(booking.date, booking.slotId, now) < CANCELLATION_POLICY.freeCancellationHours) {
    return {
      allowed: false,
      reason: `Online cancellation closes ${CANCELLATION_POLICY.freeCancellationHours} hours before your appointment`,
    };
  }
  return { allowed: true, reason: null };
}
