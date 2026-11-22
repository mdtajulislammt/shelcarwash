import { FREQUENCY_OPTIONS } from '@/features/booking/hooks/useBookingSelection';
import { formatSlotLabel } from '@/lib/format';
import type { Booking } from '@/types';
import { dateChipParts } from './calendar';

export type PassKind = 'booking' | 'plan' | 'certificate';

export interface CustomerPass {
  id: string;
  kind: PassKind;
  brand: string;
  title: string;
  code: string;
  detail: string;
  /** Tailwind gradient stops (original wallet-card palette). */
  bgColor: string;
  isNext: boolean;
}

const GRADIENTS = {
  booking: 'from-yellow-500 via-lime-500 to-zinc-900',
  pending: 'from-amber-600 via-red-700 to-stone-900',
  plan: 'from-blue-600 via-indigo-700 to-slate-900',
  certificate: 'from-emerald-600 via-teal-700 to-zinc-900',
} as const;

function shortDate(iso: string): string {
  const { month, day } = dateChipParts(iso);
  return `${month} ${day}`;
}

/**
 * Passes derived from the customer's bookings:
 * - upcoming booking → booking pass (the confirmation),
 * - recurring maintenance booking → maintenance plan pass,
 * - completed booking → digital service certificate.
 * Cancelled bookings produce no pass. Backend phase: these can be issued as Google Wallet passes.
 */
export function buildPasses(bookings: Booking[], today: string): CustomerPass[] {
  const active = bookings.filter((b) => b.status !== 'cancelled');
  const upcoming = active
    .filter((b) => b.status !== 'completed' && b.date >= today)
    .sort((a, b) => `${a.date}${a.slotId}`.localeCompare(`${b.date}${b.slotId}`));

  const passes: CustomerPass[] = upcoming.map((b, i) => ({
    id: `booking-${b.id}`,
    kind: 'booking',
    brand: 'Constant Clean',
    title: b.service.name,
    code: `PASS #${b.id}`,
    detail:
      b.paymentStatus === 'paid'
        ? `${shortDate(b.date)} • ${formatSlotLabel(b.slotId)}`
        : `${shortDate(b.date)} • Pending Payment`,
    bgColor: b.paymentStatus === 'paid' ? GRADIENTS.booking : GRADIENTS.pending,
    isNext: i === 0,
  }));

  for (const b of active) {
    if (!b.isRecurring || !b.recurringFrequency) continue;
    const frequency = FREQUENCY_OPTIONS.find((f) => f.id === b.recurringFrequency)?.label;
    passes.push({
      id: `plan-${b.id}`,
      kind: 'plan',
      brand: 'Maintenance Plan',
      title: b.service.name,
      code: `PLAN #${b.id}`,
      detail: `${frequency} • Auto-scheduled`,
      bgColor: GRADIENTS.plan,
      isNext: false,
    });
  }

  for (const b of active) {
    if (b.status !== 'completed') continue;
    passes.push({
      id: `cert-${b.id}`,
      kind: 'certificate',
      brand: 'Service Certificate',
      title: b.service.name,
      code: `CERT #${b.id}`,
      detail: `Completed ${shortDate(b.date)}`,
      bgColor: GRADIENTS.certificate,
      isNext: false,
    });
  }

  return passes;
}
