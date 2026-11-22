import { describe, expect, it } from 'vitest';
import { buildIcs, googleCalendarUrl, toUtcStamp } from './calendarExport';

const entry = {
  uid: 'CC-1',
  title: 'Detail; Full, Exotic',
  date: '2026-11-25',
  startTime: '08:00',
  endTime: '11:00',
  location: '1 Main St, Dublin',
};

describe('calendar export', () => {
  it('converts LA wall time to UTC (PST and PDT)', () => {
    expect(toUtcStamp('2026-11-25', '08:00')).toBe('20261125T160000Z');
    expect(toUtcStamp('2026-07-01', '08:00')).toBe('20260701T150000Z');
  });

  it('builds a Google Calendar template link', () => {
    const url = new URL(googleCalendarUrl(entry));
    expect(url.searchParams.get('action')).toBe('TEMPLATE');
    expect(url.searchParams.get('dates')).toBe('20261125T160000Z/20261125T190000Z');
    expect(url.searchParams.get('location')).toBe('1 Main St, Dublin');
  });

  it('builds an escaped iCalendar file', () => {
    const ics = buildIcs([entry], new Date('2026-11-22T00:00:00Z'));
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('DTSTART:20261125T160000Z');
    expect(ics).toContain('SUMMARY:Detail\\; Full\\, Exotic');
    expect(ics.split('\r\n').at(-1)).toBe('');
  });
});
