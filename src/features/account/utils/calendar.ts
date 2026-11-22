const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface YearMonth {
  year: number;
  /** 1–12 */
  month: number;
}

export interface CalendarCell {
  iso: string;
  day: number;
  inMonth: boolean;
}

export function yearMonthOf(iso: string): YearMonth {
  const [year, month] = iso.split('-').map(Number);
  return { year, month };
}

export function shiftMonth({ year, month }: YearMonth, delta: number): YearMonth {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

/** "August 2026" */
export function formatMonthLabel({ year, month }: YearMonth): string {
  return new Date(Date.UTC(year, month - 1, 1, 12)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Sunday-first month grid: trailing days of the previous month, then every day of the month. */
export function buildMonthGrid({ year, month }: YearMonth): CalendarCell[] {
  const first = Date.UTC(year, month - 1, 1);
  const leading = new Date(first).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({ length: leading + daysInMonth }, (_, i) => {
    const date = new Date(first + (i - leading) * MS_PER_DAY);
    return {
      iso: date.toISOString().slice(0, 10),
      day: date.getUTCDate(),
      inMonth: i >= leading,
    };
  });
}

/** Parts for the date chip: "Aug" · "25" · ", 2026" */
export function dateChipParts(iso: string): { month: string; day: number; year: number } {
  const [year, month, day] = iso.split('-').map(Number);
  const label = new Date(Date.UTC(year, month - 1, day, 12)).toLocaleDateString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });
  return { month: label, day, year };
}
