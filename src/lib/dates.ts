import { BOOKING_WINDOW_DAYS, SITE } from '@/config/site';

/** All business dates and slots are in this zone, regardless of the visitor's device. */
export const BUSINESS_TZ = SITE.timeZone;

const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * MS_PER_HOUR;

function parseIsoDate(iso: string): [number, number, number] {
  const [y, m, d] = iso.split('-').map(Number);
  return [y, m, d];
}

/** Noon UTC of a calendar date — safe for weekday/month formatting with timeZone 'UTC'. */
function isoToUtcNoon(iso: string): Date {
  const [y, m, d] = parseIsoDate(iso);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

/** Calendar date (YYYY-MM-DD) of `instant` as seen in `timeZone`. */
export function toIsoDateInZone(instant: Date, timeZone: string = BUSINESS_TZ): string {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant);
}

export function todayInBusinessTz(now: Date = new Date()): string {
  return toIsoDateInZone(now, BUSINESS_TZ);
}

export function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = parseIsoDate(iso);
  return new Date(Date.UTC(y, m - 1, d) + days * MS_PER_DAY).toISOString().slice(0, 10);
}

export interface BookableDate {
  iso: string;
  dayName: string;
  monthDay: string;
}

/** Bookable dates: starts tomorrow (LA time) and spans BOOKING_WINDOW_DAYS days. */
export function getBookableDates(
  now: Date = new Date(),
  days: number = BOOKING_WINDOW_DAYS,
): BookableDate[] {
  const today = todayInBusinessTz(now);
  return Array.from({ length: days }, (_, i) => {
    const iso = addDaysIso(today, i + 1);
    const date = isoToUtcNoon(iso);
    return {
      iso,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
      monthDay: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      }),
    };
  });
}

export function isBookableDate(iso: string, now: Date = new Date()): boolean {
  return getBookableDates(now).some((d) => d.iso === iso);
}

/** Offset (ms) of `timeZone` from UTC at `instant`. LA is -7h (PDT) or -8h (PST). */
export function getTimeZoneOffsetMs(instant: Date, timeZone: string = BUSINESS_TZ): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

/** Converts a wall-clock date + "HH:mm" in `timeZone` to the exact UTC instant. */
export function zonedDateTimeToUtc(
  iso: string,
  time: string,
  timeZone: string = BUSINESS_TZ,
): Date {
  const [y, m, d] = parseIsoDate(iso);
  const [hh, mm] = time.split(':').map(Number);
  const naive = Date.UTC(y, m - 1, d, hh, mm);
  // Two passes handle DST transitions correctly.
  let utc = naive - getTimeZoneOffsetMs(new Date(naive), timeZone);
  utc = naive - getTimeZoneOffsetMs(new Date(utc), timeZone);
  return new Date(utc);
}

/** Hours from `now` until the appointment start (negative if it is in the past). */
export function hoursUntil(iso: string, time: string, now: Date = new Date()): number {
  return (zonedDateTimeToUtc(iso, time).getTime() - now.getTime()) / MS_PER_HOUR;
}

/** "Mon, Jan 5, 2026" — matches the original design's date format. */
export function formatDateString(iso: string): string {
  if (!iso) return '';
  return isoToUtcNoon(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
