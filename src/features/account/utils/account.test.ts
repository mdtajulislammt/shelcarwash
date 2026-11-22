import { describe, expect, it } from 'vitest';
import { buildMonthGrid, formatMonthLabel, shiftMonth } from './calendar';
import { getFirstName, getInitials } from './profile';

describe('calendar utils', () => {
  it('builds a Sunday-first grid with leading days of the previous month', () => {
    // August 2026 starts on a Saturday → 6 leading days (Jul 26–31)
    const grid = buildMonthGrid({ year: 2026, month: 8 });
    expect(grid).toHaveLength(6 + 31);
    expect(grid[0]).toEqual({ iso: '2026-07-26', day: 26, inMonth: false });
    expect(grid[6]).toEqual({ iso: '2026-08-01', day: 1, inMonth: true });
    expect(grid.at(-1)?.iso).toBe('2026-08-31');
  });

  it('shifts months across year boundaries', () => {
    expect(shiftMonth({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
    expect(shiftMonth({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
    expect(formatMonthLabel({ year: 2026, month: 8 })).toBe('August 2026');
  });
});

describe('profile utils', () => {
  it('derives initials and first name', () => {
    expect(getInitials('Mac Millins')).toBe('MM');
    expect(getInitials('  jane  ')).toBe('J');
    expect(getInitials('')).toBe('?');
    expect(getFirstName('Mac Millins')).toBe('Mac');
  });
});
