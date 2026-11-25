import { CheckCircle2, Clock, Eye, Trash2 } from 'lucide-react';
import { getPaymentMethodOption } from '@/features/booking/components/checkout/paymentMethods';
import { formatDateString } from '@/lib/dates';
import { formatCurrency, formatSlotLabel } from '@/lib/format';
import type { Booking } from '@/types';
import { getCancelEligibility } from '../utils/cancellation';
import { BookingProgress } from './BookingProgress';

interface BookingCardProps {
  booking: Booking;
  isSelected: boolean;
  onSelect: () => void;
  onCancel: () => void;
}

export function BookingCard({ booking: bk, isSelected, onSelect, onCancel }: BookingCardProps) {
  const eligibility = getCancelEligibility(bk);
  const isPaid = bk.paymentStatus === 'paid';

  return (
    <div
      onClick={onSelect}
      className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
        isSelected
          ? 'bg-gradient-to-r from-lime-950/90 via-card to-lime-900/80 border-brand ring-1 ring-brand/40 shadow-md shadow-brand/20'
          : 'bg-card/80 hover:bg-card-hover border-zinc-700'
      }`}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-brand">{bk.service.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              {bk.vehicleCategory.toUpperCase()}
            </span>
            {bk.isRecurring && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-gradient-to-r from-slate-200 via-zinc-300 to-slate-400 text-ink border border-white/80 capitalize">
                Reoccurring Cleanings{bk.recurringFrequency ? ` • ${bk.recurringFrequency}` : ''}
              </span>
            )}
          </div>
          <h4 className="text-lg font-bold text-white mt-1">
            {bk.customer.vehicleYear} {bk.customer.vehicleMake} {bk.customer.vehicleModel}
          </h4>
          <p className="text-xs text-zinc-400">
            Plate: {bk.customer.licensePlate} • Client: {bk.customer.fullName}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-lg font-black text-white">{formatCurrency(bk.totalPrice)}</span>
          <div
            className={`flex items-center justify-end space-x-1 text-[10px] font-bold mt-0.5 ${
              isPaid ? 'text-lime-400' : 'text-brand'
            }`}
          >
            {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            <span>{isPaid ? 'Paid' : 'Pending payment'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-page text-xs border border-zinc-800">
        <div>
          <span className="text-[10px] text-zinc-400 font-semibold block uppercase">
            Scheduled Time
          </span>
          <span className="font-bold text-zinc-200">
            {formatDateString(bk.date)} @ {formatSlotLabel(bk.slotId)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 font-semibold block uppercase">
            Payment Method
          </span>
          <span className="font-bold text-brand">
            {getPaymentMethodOption(bk.paymentMethod).title}
          </span>
        </div>
      </div>

      <BookingProgress status={bk.status} />

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800 text-xs">
        <span className="text-zinc-400 text-[11px] min-w-0 truncate">
          ID: <span className="font-mono text-zinc-300">{bk.id}</span>
        </span>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="px-3 py-1.5 min-h-11 rounded-lg bg-lime-950/80 hover:bg-lime-900 border border-lime-800 text-lime-300 text-xs font-bold flex items-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>

          {bk.status !== 'cancelled' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              disabled={!eligibility.allowed}
              aria-label="Cancel appointment"
              title={eligibility.allowed ? 'Cancel Appointment' : (eligibility.reason ?? undefined)}
              className="p-1.5 min-h-11 min-w-11 flex items-center justify-center rounded-lg bg-card hover:bg-rose-950 text-zinc-300 hover:text-rose-300 transition-colors border border-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:text-zinc-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
