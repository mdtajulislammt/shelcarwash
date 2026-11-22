import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { CANCELLATION_POLICY } from '@/config/site';
import { formatDateString } from '@/lib/dates';
import { formatSlotLabel } from '@/lib/format';
import type { Booking } from '@/types';

interface CancelBookingDialogProps {
  booking: Booking | null;
  isPending: boolean;
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export function CancelBookingDialog({
  booking,
  isPending,
  error,
  onConfirm,
  onClose,
}: CancelBookingDialogProps) {
  return (
    <Modal
      open={!!booking}
      onClose={() => !isPending && onClose()}
      labelledBy="cancel-title"
      className="max-w-md"
    >
      {booking && (
        <div className="space-y-5">
          <div className="pr-12">
            <h3 id="cancel-title" className="text-xl font-extrabold text-white">
              Cancel this appointment?
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {booking.service.name} • {formatDateString(booking.date)} @{' '}
              {formatSlotLabel(booking.slotId)}
            </p>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">{CANCELLATION_POLICY.text}</p>
          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-3 rounded-xl font-semibold text-xs transition-all"
            >
              Keep Appointment
            </Button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 py-3 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 font-extrabold text-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isPending && <Spinner className="w-4 h-4 text-rose-200" />}
              <span>Yes, Cancel</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
