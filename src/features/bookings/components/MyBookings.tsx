import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import type { Booking, BookingLookup } from '@/types';
import { useBookings, useCancelBooking } from '../hooks/useBookings';
import { useLookupStore } from '../store/lookupStore';
import { BookingDetailsPanel } from './BookingDetailsPanel';
import { BookingList } from './BookingList';
import { CancelBookingDialog } from './CancelBookingDialog';
import { EmptyBookings } from './EmptyBookings';

/** "My Bookings" — list on the left, booking details on the right (original dashboard layout). */
export function MyBookings({ onStartNewBooking }: { onStartNewBooking: () => void }) {
  const lookup = useLookupStore((s) => s.lookup);
  const setLookup = useLookupStore((s) => s.setLookup);
  const clearLookup = useLookupStore((s) => s.clearLookup);
  const { data: bookings, isLoading, error } = useBookings(lookup);
  const cancel = useCancelBooking();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toCancel, setToCancel] = useState<Booking | null>(null);

  const handleLookup = (next: BookingLookup) => {
    setSelectedId(null);
    setLookup(next);
  };

  if (lookup && isLoading) {
    return (
      <div className="py-24 flex justify-center" aria-live="polite">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="space-y-8 py-6">
        {error && <p className="text-xs text-rose-400">{error.message}</p>}
        <EmptyBookings
          lookup={lookup}
          onLookup={handleLookup}
          onStartNewBooking={onStartNewBooking}
        />
      </div>
    );
  }

  const selected = bookings.find((b) => b.id === selectedId) ?? bookings[0];

  return (
    <div className="space-y-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <BookingList
            bookings={bookings}
            selectedId={selected.id}
            onSelect={(b) => setSelectedId(b.id)}
            onCancel={setToCancel}
            lookupLabel={lookup?.email ?? lookup?.phone ?? ''}
            onChangeLookup={clearLookup}
          />
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <CalendarCheck className="w-5 h-5 text-lime-400" />
              <span>Booking Details</span>
            </h3>
            <BookingDetailsPanel booking={selected} onCancel={() => setToCancel(selected)} />
          </div>
        </div>
      </div>

      <CancelBookingDialog
        booking={toCancel}
        isPending={cancel.isPending}
        error={cancel.error?.message ?? null}
        onClose={() => {
          cancel.reset();
          setToCancel(null);
        }}
        onConfirm={() =>
          toCancel &&
          cancel.mutate(toCancel.id, {
            onSuccess: () => setToCancel(null),
          })
        }
      />
    </div>
  );
}
