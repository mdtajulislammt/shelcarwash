import { useEffect, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { TIME_SLOTS } from '@/config/site';
import { getBookableDates } from '@/lib/dates';
import { useAvailability } from '../hooks/useAvailability';
import { useBookingStore } from '../store/bookingStore';

const SELECTED =
  'bg-yellow-300 text-black font-extrabold border-yellow-300 shadow-md shadow-yellow-300/30';
const IDLE = 'bg-[#3a3a3a] hover:bg-[#4a4a4a] border-zinc-600 text-zinc-200';
const UNAVAILABLE = 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed';

/** Step 1: date (tomorrow + 13 days, LA time) and one of three arrival windows. */
export function Scheduler({
  totalDuration,
  slotError,
}: {
  totalDuration: number;
  slotError?: string;
}) {
  const date = useBookingStore((s) => s.date);
  const slotId = useBookingStore((s) => s.slotId);
  const setDate = useBookingStore((s) => s.setDate);
  const setSlot = useBookingStore((s) => s.setSlot);
  const dates = useMemo(() => getBookableDates(), []);
  const { data: slots, isFetching } = useAvailability(date);

  // Keep the selected date inside the bookable window (e.g. after midnight in LA).
  useEffect(() => {
    if (!dates.some((d) => d.iso === date)) setDate(dates[0].iso);
  }, [dates, date, setDate]);

  // Like the original design, always have a slot selected: pick the first open one.
  useEffect(() => {
    if (!slots) return;
    const current = slots.find((s) => s.id === slotId);
    if (!current || !current.available) setSlot(slots.find((s) => s.available)?.id ?? null);
  }, [slots, slotId, setSlot]);

  const displaySlots = slots ?? TIME_SLOTS.map((s) => ({ ...s, available: false }));
  const noneAvailable = !!slots && slots.every((s) => !s.available);

  return (
    <div className="space-y-4 pt-2">
      <h3 className="text-base font-bold text-white flex items-center space-x-2">
        <Clock className="w-4 h-4 text-yellow-300" />
        <span>1. Choose Appointment Date & Time</span>
      </h3>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-zinc-300 block">Select Date:</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {dates.map((item) => {
            const isSelected = date === item.iso;
            return (
              <button
                key={item.iso}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setDate(item.iso)}
                className={`p-3 rounded-xl text-center border transition-all ${isSelected ? SELECTED : IDLE}`}
              >
                <span className="block text-[11px] uppercase tracking-wider opacity-80">
                  {item.dayName}
                </span>
                <span className="block text-sm font-extrabold mt-0.5">{item.monthDay}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <span className="text-xs font-semibold text-zinc-300 block">
          Select Time Slot ({totalDuration} mins estimated):
        </span>
        <div className="grid grid-cols-3 gap-3" aria-busy={isFetching}>
          {displaySlots.map((slot) => {
            const isSelected = slotId === slot.id && slot.available;
            return (
              <button
                key={slot.id}
                type="button"
                aria-pressed={isSelected}
                disabled={!slot.available}
                onClick={() => setSlot(slot.id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isSelected ? SELECTED : slot.available ? IDLE : UNAVAILABLE
                }`}
              >
                <span className="block text-xs font-extrabold">{slot.label}</span>
                <span className="block text-[10px] opacity-70 mt-0.5">
                  {slots && !slot.available ? 'Unavailable' : slot.period}
                </span>
              </button>
            );
          })}
        </div>
        {noneAvailable && (
          <p className="text-xs text-zinc-400">
            This day is fully booked — please pick another date.
          </p>
        )}
        {slotError && <p className="text-xs text-rose-400 mt-1">{slotError}</p>}
      </div>
    </div>
  );
}
