import { BUSINESS_TZ, zonedDateTimeToUtc } from './dates';

/** One calendar entry; date/times are wall-clock in America/Los_Angeles. */
export interface CalendarEntry {
  uid: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
}

/** "2026-11-25" + "08:00" (LA) → "20261125T160000Z" */
export function toUtcStamp(date: string, time: string): string {
  return zonedDateTimeToUtc(date, time)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/** "Add to Google Calendar" template link (no API access or sign-in needed on our side). */
export function googleCalendarUrl(entry: CalendarEntry): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: entry.title,
    dates: `${toUtcStamp(entry.date, entry.startTime)}/${toUtcStamp(entry.date, entry.endTime)}`,
    ctz: BUSINESS_TZ,
  });
  if (entry.description) params.set('details', entry.description);
  if (entry.location) params.set('location', entry.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** iCalendar file (RFC 5545) — imports into Apple Calendar, Outlook and Google Calendar. */
export function buildIcs(entries: CalendarEntry[], now: Date = new Date()): string {
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Constant Clean//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];
  for (const e of entries) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.uid}@constantclean`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${toUtcStamp(e.date, e.startTime)}`,
      `DTEND:${toUtcStamp(e.date, e.endTime)}`,
      `SUMMARY:${escapeIcsText(e.title)}`,
    );
    if (e.location) lines.push(`LOCATION:${escapeIcsText(e.location)}`);
    if (e.description) lines.push(`DESCRIPTION:${escapeIcsText(e.description)}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

export function downloadIcs(filename: string, entries: CalendarEntry[]): void {
  const blob = new Blob([buildIcs(entries)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
