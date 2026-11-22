import { describe, expect, it } from 'vitest';
import { getCancelEligibility } from './cancellation';

// 2026-12-01 08:00 in LA (PST) = 2026-12-01T16:00:00Z
const booking = { date: '2026-12-01', slotId: '08:00', status: 'confirmed' as const };

describe('24h cancellation rule (LA time)', () => {
  it('allows cancelling exactly 24h before', () => {
    expect(getCancelEligibility(booking, new Date('2026-11-30T16:00:00Z')).allowed).toBe(true);
  });

  it('blocks cancelling within 24h', () => {
    const r = getCancelEligibility(booking, new Date('2026-11-30T16:01:00Z'));
    expect(r.allowed).toBe(false);
    expect(r.reason).toMatch(/24 hours/);
  });

  it('blocks cancelled, in-progress and completed bookings', () => {
    const early = new Date('2026-11-20T00:00:00Z');
    expect(getCancelEligibility({ ...booking, status: 'cancelled' }, early).allowed).toBe(false);
    expect(getCancelEligibility({ ...booking, status: 'completed' }, early).allowed).toBe(false);
    expect(getCancelEligibility({ ...booking, status: 'in_progress' }, early).allowed).toBe(false);
  });
});
