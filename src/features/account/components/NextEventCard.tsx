import { Calendar as CalendarIcon, Car } from 'lucide-react';
import type { ScheduleItem } from '../utils/schedule';
import { DateChip } from './DateChip';
import { TimeChip } from './TimeChip';

interface NextEventCardProps {
  item: ScheduleItem | undefined;
  onBook: () => void;
}

export function NextEventCard({ item, onBook }: NextEventCardProps) {
  if (!item) {
    return (
      <div className="p-4 rounded-xl border-2 border-yellow-400/80 shadow-sm shadow-yellow-400/20 bg-gradient-to-r from-yellow-950/20 via-[#0a0a0d] to-yellow-950/20 space-y-2 mt-3 text-center">
        <div className="flex items-center justify-center space-x-1.5 text-yellow-400 font-extrabold uppercase text-[10px] tracking-wider">
          <CalendarIcon className="w-3.5 h-3.5 text-lime-400" />
          <span>Next Event on Schedule</span>
        </div>
        <p className="text-sm font-black text-white pt-1">Please book an appointment</p>
        <p className="text-[11px] text-zinc-400">No upcoming events found on your schedule.</p>
        <button
          type="button"
          onClick={onBook}
          className="mt-1 px-3.5 py-1.5 min-h-11 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-all shadow-md inline-flex items-center space-x-1.5 cursor-pointer"
        >
          <CalendarIcon className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Book an Appointment</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-xl border-2 border-yellow-400 shadow-sm shadow-yellow-400/20 bg-gradient-to-r from-lime-950/40 via-[#0a0a0d] to-lime-950/40 space-y-2 mt-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-extrabold uppercase text-yellow-400 tracking-wider flex items-center space-x-1">
          <CalendarIcon className="w-3.5 h-3.5 text-lime-400" />
          <span>Next Event on Schedule</span>
        </span>
        <DateChip iso={item.date} />
      </div>
      <p className="text-xs font-extrabold text-white leading-tight pt-0.5">{item.title}</p>
      <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-400 pt-1.5 border-t border-zinc-800/80">
        <TimeChip label={item.timeLabel} />
        {item.vehicle && (
          <span className="flex items-center space-x-1 truncate max-w-[170px]">
            <Car className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="truncate text-zinc-300">{item.vehicle}</span>
          </span>
        )}
      </div>
    </div>
  );
}
