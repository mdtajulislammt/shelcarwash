import { Calendar as CalendarIcon, Car, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ScheduleItem } from '../utils/schedule';
import { CalendarSyncMenu } from './CalendarSyncMenu';
import { DateChip } from './DateChip';
import { TimeChip } from './TimeChip';

interface UpcomingAppointmentsProps {
  schedule: ScheduleItem[];
  onBook: () => void;
  onAddEvent: () => void;
  onDeleteEvent: (eventId: string) => void;
  deletingId: string | null;
}

export function UpcomingAppointments({
  schedule,
  onBook,
  onAddEvent,
  onDeleteEvent,
  deletingId,
}: UpcomingAppointmentsProps) {
  return (
    <div className="bg-surface-4 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <h3 className="text-sm font-extrabold text-white">Upcoming Events</h3>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onAddEvent}
            className="relative px-2.5 py-1 rounded-lg bg-brand/10 hover:bg-brand/20 text-brand border border-brand/30 text-[10px] font-extrabold flex items-center space-x-1 transition-all cursor-pointer after:absolute after:-inset-2 after:content-['']"
          >
            <Plus className="w-3 h-3 stroke-[3]" />
            <span>Add Manual Event</span>
          </button>
          <Link
            to="/bookings"
            className="relative px-2.5 py-1 rounded-lg bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 border border-lime-400/20 text-[10px] font-extrabold flex items-center space-x-0.5 transition-all after:absolute after:-inset-2 after:content-['']"
          >
            <span>Bookings</span>
            <ChevronRight className="w-3 h-3 stroke-[3]" />
          </Link>
        </div>
      </div>

      {schedule.length === 0 ? (
        <div className="p-6 rounded-xl border border-zinc-800 bg-surface text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto text-brand">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <p className="text-base font-extrabold text-white">Please book an appointment</p>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            No upcoming events yet. Book an appointment or add a manual event to see it on your
            schedule.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={onBook}
              className="px-4 py-2 min-h-11 rounded-xl bg-brand hover:bg-brand-2 text-ink font-extrabold text-xs transition-all shadow-md inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <CalendarIcon className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Book an Appointment</span>
            </button>
            <button
              type="button"
              onClick={onAddEvent}
              className="px-4 py-2 min-h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-extrabold text-xs transition-all inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Manual Event</span>
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {schedule.map((item) => (
            <li
              key={item.id}
              className={`p-3.5 rounded-xl border-2 shadow-sm space-y-2 bg-gradient-to-r via-surface ${
                item.kind === 'booking'
                  ? 'border-brand shadow-brand/20 from-lime-950/40 to-lime-950/40'
                  : 'border-lime-400/60 shadow-lime-400/10 from-zinc-900 to-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <DateChip iso={item.date} />
                <span className="px-2.5 py-1 rounded-lg bg-lime-400/15 border border-brand/40 text-[10px] font-extrabold text-lime-300 uppercase whitespace-nowrap shrink-0">
                  {item.statusLabel}
                </span>
              </div>
              <TimeChip label={item.timeLabel} />
              <p className="text-xs font-extrabold text-white leading-tight pt-0.5">{item.title}</p>
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1.5 border-t border-zinc-800/80">
                <span className="flex items-center space-x-1 truncate max-w-[200px]">
                  {item.vehicle && (
                    <>
                      <Car className="w-3.5 h-3.5 text-brand shrink-0" />
                      <span className="truncate text-zinc-300">{item.vehicle}</span>
                    </>
                  )}
                </span>
                <div className="flex items-center">
                  {item.kind === 'manual' && (
                    <button
                      type="button"
                      aria-label={`Delete ${item.title}`}
                      disabled={deletingId === item.sourceId}
                      onClick={() => onDeleteEvent(item.sourceId)}
                      className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <CalendarSyncMenu item={item} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
