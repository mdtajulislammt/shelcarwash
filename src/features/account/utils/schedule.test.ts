import { describe, expect, it } from 'vitest';
import type { ManualEvent } from '../schemas';
import { buildSchedule, eventToScheduleItem, toCalendarEntry } from './schedule';

const event = (over: Partial<ManualEvent>): ManualEvent => ({
  id: 'E1',
  title: 'Tire rotation',
  date: '2026-11-24',
  startTime: '09:30',
  endTime: '10:30',
  vehicle: '2024 Porsche 911',
  location: 'Dealer',
  notes: '',
  createdAt: '2026-11-01T00:00:00Z',
  ...over,
});

describe('schedule', () => {
  it('maps manual events and sorts upcoming items', () => {
    const items = buildSchedule(
      [],
      [
        event({ id: 'B', date: '2026-11-30' }),
        event({ id: 'A' }),
        event({ id: 'old', date: '2026-11-01' }),
      ],
      '2026-11-22',
      'Studio',
    );
    expect(items.map((i) => i.sourceId)).toEqual(['A', 'B']);
    expect(items[0].timeLabel).toBe('9:30 AM–10:30 AM');
    expect(items[0].statusLabel).toBe('Personal');
  });

  it('converts to a calendar entry', () => {
    const entry = toCalendarEntry(eventToScheduleItem(event({})));
    expect(entry).toMatchObject({ title: 'Tire rotation', startTime: '09:30', location: 'Dealer' });
  });
});
