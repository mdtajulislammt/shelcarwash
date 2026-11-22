import { describe, expect, it } from 'vitest';
import {
  addDaysIso,
  formatDateString,
  getBookableDates,
  hoursUntil,
  todayInBusinessTz,
  zonedDateTimeToUtc,
} from './dates';

describe('LA date helpers', () => {
  it('uses the Los Angeles calendar date, not UTC', () => {
    // 07:30 UTC on Nov 22 is still 23:30 on Nov 21 in LA (PST, UTC-8)
    expect(todayInBusinessTz(new Date('2026-11-22T07:30:00Z'))).toBe('2026-11-21');
    expect(todayInBusinessTz(new Date('2026-11-22T08:30:00Z'))).toBe('2026-11-22');
  });

  it('lists 14 days starting tomorrow (LA)', () => {
    const dates = getBookableDates(new Date('2026-11-22T07:30:00Z'));
    expect(dates).toHaveLength(14);
    expect(dates[0]).toEqual({ iso: '2026-11-22', dayName: 'Sun', monthDay: 'Nov 22' });
    expect(dates[13].iso).toBe('2026-12-05');
  });

  it('adds days across month/year boundaries', () => {
    expect(addDaysIso('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDaysIso('2028-02-28', 1)).toBe('2028-02-29');
  });

  it('converts LA wall-clock times to UTC across DST', () => {
    expect(zonedDateTimeToUtc('2026-07-01', '08:00').toISOString()).toBe(
      '2026-07-01T15:00:00.000Z',
    );
    expect(zonedDateTimeToUtc('2026-12-01', '14:00').toISOString()).toBe(
      '2026-12-01T22:00:00.000Z',
    );
    // DST ends Nov 1 2026 — 08:00 that day is already PST
    expect(zonedDateTimeToUtc('2026-11-01', '08:00').toISOString()).toBe(
      '2026-11-01T16:00:00.000Z',
    );
  });

  it('computes hours until an appointment', () => {
    expect(hoursUntil('2026-12-01', '08:00', new Date('2026-11-30T16:00:00Z'))).toBe(24);
  });

  it('formats dates like the original design', () => {
    expect(formatDateString('2026-11-23')).toBe('Mon, Nov 23, 2026');
  });
});
