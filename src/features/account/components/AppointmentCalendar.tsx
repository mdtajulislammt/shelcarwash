import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { downloadIcs } from '@/lib/calendarExport';
import { todayInBusinessTz } from '@/lib/dates';
import { buildMonthGrid, formatMonthLabel, shiftMonth, yearMonthOf } from '../utils/calendar';
import { toCalendarEntry, type ScheduleItem } from '../utils/schedule';
import { NextEventCard } from './NextEventCard';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface AppointmentCalendarProps {
  schedule: ScheduleItem[];
  onBook: () => void;
}

/** Month calendar of the customer's upcoming appointments (LA dates). */
export function AppointmentCalendar({ schedule, onBook }: AppointmentCalendarProps) {
  const [month, setMonth] = useState(() => yearMonthOf(schedule[0]?.date ?? todayInBusinessTz()));
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const bookedDates = new Set(schedule.map((i) => i.date));
  const manualDates = new Set(schedule.filter((i) => i.kind === 'manual').map((i) => i.date));
  const selected = schedule.find((i) => i.date === selectedIso) ?? schedule[0];

  return (
    <div className="bg-surface-4 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-brand" />
            <h3 className="text-sm font-extrabold text-white whitespace-nowrap">My Calendar</h3>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <span className="font-bold text-white mr-1 whitespace-nowrap">
              {formatMonthLabel(month)}
            </span>
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setMonth((m) => shiftMonth(m, -1))}
              className="relative p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white after:absolute after:-inset-2.5 after:content-['']"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setMonth((m) => shiftMonth(m, 1))}
              className="relative p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white after:absolute after:-inset-2.5 after:content-['']"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-brand uppercase">
          {WEEKDAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-xs">
          {buildMonthGrid(month).map((cell) => {
            if (!cell.inMonth) {
              return (
                <div key={cell.iso} className="p-1.5 text-center text-lime-400/30">
                  {cell.day}
                </div>
              );
            }
            const hasAppt = bookedDates.has(cell.iso);
            const isSelected = hasAppt && selected?.date === cell.iso;
            return (
              <button
                key={cell.iso}
                type="button"
                disabled={!hasAppt}
                aria-pressed={hasAppt ? isSelected : undefined}
                onClick={() => setSelectedIso(cell.iso)}
                className={`p-1.5 text-center rounded-lg font-bold transition-all relative disabled:cursor-default ${
                  hasAppt
                    ? `bg-gradient-to-r from-lime-950/40 via-surface to-lime-950/40 text-white font-extrabold border-2 shadow-sm shadow-brand/20 ${isSelected ? 'border-brand' : 'border-brand/50'}`
                    : 'text-lime-400'
                }`}
              >
                <span className={hasAppt ? 'text-white font-black' : ''}>{cell.day}</span>
                {hasAppt && (
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${manualDates.has(cell.iso) ? 'bg-lime-400' : 'bg-brand'}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <NextEventCard item={selected} onBook={onBook} />
      </div>

      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="flex items-center space-x-1.5">
          <span
            className={`w-2 h-2 rounded-full ${schedule.length > 0 ? 'bg-lime-400' : 'bg-zinc-600'} inline-block`}
          />
          <span className={schedule.length > 0 ? 'text-lime-400 font-medium' : 'text-zinc-400'}>
            {schedule.length > 0 ? 'Service Scheduled' : 'No Active Schedule'}
          </span>
        </span>
        {schedule.length > 0 ? (
          <button
            type="button"
            onClick={() =>
              downloadIcs('constant-clean-schedule.ics', schedule.map(toCalendarEntry))
            }
            className="relative text-brand hover:text-brand-2 font-semibold flex items-center space-x-1 after:absolute after:-inset-3 after:content-['']"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Sync All ({schedule.length})</span>
          </button>
        ) : (
          <span className="text-lime-400 font-semibold">0 Upcoming</span>
        )}
      </div>
    </div>
  );
}
