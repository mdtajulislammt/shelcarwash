import { Calendar, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { BookingLookup } from '@/types';
import { BookingLookupForm } from './BookingLookupForm';

interface EmptyBookingsProps {
  lookup: BookingLookup | null;
  onLookup: (lookup: BookingLookup) => void;
  onStartNewBooking: () => void;
}

export function EmptyBookings({ lookup, onLookup, onStartNewBooking }: EmptyBookingsProps) {
  const searched = lookup?.email ?? lookup?.phone;

  return (
    <div className="bg-[#18181c] rounded-3xl border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="flex items-center space-x-3 border-b border-zinc-800/80 pb-6">
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#0a0a0d] border border-zinc-700 flex items-center justify-center p-2 shadow-lg shadow-yellow-400/10">
          <CalendarCheck className="w-7 h-7 text-yellow-300" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-white">My Bookings</h3>
          <p className="text-xs text-zinc-400">
            View, track and cancel your appointments with the email or phone you booked with
          </p>
        </div>
      </div>

      <div className="text-center py-10 px-4 bg-[#0a0a0d] rounded-2xl border border-zinc-800 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
          <Calendar className="w-6 h-6" />
        </div>
        <p className="text-white text-sm font-bold">
          {searched ? `No bookings found for ${searched}` : 'Find your bookings'}
        </p>
        <p className="text-zinc-400 text-xs max-w-sm mx-auto">
          Enter the email address or phone number you used at checkout.
        </p>
        <BookingLookupForm onSubmit={onLookup} />
      </div>

      <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-400">
          Ready to schedule your vehicle detailing? You'll receive a booking confirmation right
          after checkout.
        </p>
        <Button
          onClick={onStartNewBooking}
          className="w-full sm:w-auto min-h-11 px-6 py-3 rounded-xl text-xs transition-all shadow-lg shadow-yellow-400/20 flex items-center justify-center space-x-2 shrink-0"
        >
          <Calendar className="w-4 h-4 text-black" />
          <span>Schedule Detailing Service</span>
        </Button>
      </div>
    </div>
  );
}
