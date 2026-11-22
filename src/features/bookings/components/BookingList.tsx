import { useState } from 'react';
import type { Booking } from '@/types';
import { BookingCard } from './BookingCard';

interface BookingListProps {
  bookings: Booking[];
  selectedId: string | null;
  onSelect: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
  lookupLabel: string;
  onChangeLookup: () => void;
}

const TAB_ACTIVE = 'bg-[#505050] text-white font-extrabold border border-zinc-400 shadow-sm';
const TAB_IDLE = 'text-zinc-300 hover:text-white';

export function BookingList({
  bookings,
  selectedId,
  onSelect,
  onCancel,
  lookupLabel,
  onChangeLookup,
}: BookingListProps) {
  const [tab, setTab] = useState<'upcoming' | 'all'>('upcoming');
  const active = bookings.filter((b) => b.status !== 'cancelled');
  const displayed = tab === 'upcoming' ? active : bookings;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div
          className="flex space-x-2 text-xs font-bold p-1 bg-[#3a3a3a] rounded-xl border border-zinc-600/80"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'upcoming'}
            onClick={() => setTab('upcoming')}
            className={`px-3 py-1.5 min-h-10 rounded-lg transition-colors ${tab === 'upcoming' ? TAB_ACTIVE : TAB_IDLE}`}
          >
            Active ({active.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'all'}
            onClick={() => setTab('all')}
            className={`px-3 py-1.5 min-h-10 rounded-lg transition-colors ${tab === 'all' ? TAB_ACTIVE : TAB_IDLE}`}
          >
            History ({bookings.length})
          </button>
        </div>
        <p className="text-[11px] text-zinc-400 min-w-0">
          <span className="break-all">{lookupLabel}</span> ·{' '}
          <button
            type="button"
            onClick={onChangeLookup}
            className="py-3 text-yellow-300 hover:text-yellow-200 font-bold"
          >
            Change
          </button>
        </p>
      </div>

      <div className="space-y-4">
        {displayed.length === 0 && (
          <div className="p-6 rounded-2xl bg-[#0f0f13] border border-zinc-800 text-center text-zinc-400 text-xs">
            No active bookings. Check the History tab for past and cancelled appointments.
          </div>
        )}
        {displayed.map((bk) => (
          <BookingCard
            key={bk.id}
            booking={bk}
            isSelected={selectedId === bk.id}
            onSelect={() => onSelect(bk)}
            onCancel={() => onCancel(bk)}
          />
        ))}
      </div>
    </div>
  );
}
