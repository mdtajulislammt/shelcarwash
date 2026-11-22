import { Award, CalendarCheck, Info } from 'lucide-react';
import { CancellationPolicy } from '@/features/booking/components/CancellationPolicy';
import { PaymentStatusBadge } from '@/features/booking/components/PaymentStatusBadge';
import { getPaymentMethodOption } from '@/features/booking/components/checkout/paymentMethods';
import { formatDateString } from '@/lib/dates';
import { formatCurrency, formatSlotLabel } from '@/lib/format';
import type { Booking } from '@/types';
import { getCancelEligibility } from '../utils/cancellation';

export function BookingDetailsPanel({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: () => void;
}) {
  const c = booking.customer;
  const method = getPaymentMethodOption(booking.paymentMethod);
  const eligibility = getCancelEligibility(booking);
  const isCancelled = booking.status === 'cancelled';

  return (
    <div className="bg-gradient-to-b from-[#18181c] via-[#121216] to-[#18181c] p-6 rounded-3xl border border-yellow-300/40 shadow-2xl space-y-5 text-white">
      <div className="flex justify-between items-start gap-2 border-b border-zinc-800 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 shrink-0 rounded-xl bg-gradient-to-tr from-yellow-300 to-lime-400 flex items-center justify-center font-black text-black text-xs">
            CC
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white">Constant Clean Detailing</h4>
            <p className="text-[10px] text-yellow-300 font-bold">Booking Confirmation</p>
          </div>
        </div>
        <PaymentStatusBadge status={booking.paymentStatus} />
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
            Service Package
          </span>
          <h3 className="text-xl font-extrabold text-white">{booking.service.name}</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-[#050505] border border-zinc-800">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Vehicle</span>
            <span className="font-bold text-zinc-200">
              {c.vehicleYear} {c.vehicleMake} {c.vehicleModel}
            </span>
            <span className="block text-[10px] text-zinc-400 mt-0.5">Plate: {c.licensePlate}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Appointment</span>
            <span className="font-bold text-yellow-400">{formatDateString(booking.date)}</span>
            <span className="block text-[10px] text-zinc-300">
              @ {formatSlotLabel(booking.slotId)}
            </span>
          </div>
        </div>

        <div className="text-xs text-zinc-300 space-y-1">
          <div className="flex justify-between gap-3">
            <span className="text-zinc-400">Customer:</span>
            <span className="font-bold text-white text-right">{c.fullName}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-zinc-400">Total ({method.title}):</span>
            <span
              className={`font-bold ${booking.paymentStatus === 'paid' ? 'text-lime-400' : 'text-yellow-300'}`}
            >
              {formatCurrency(booking.totalPrice)}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-zinc-400 shrink-0">Service Location:</span>
            <span className="font-semibold text-zinc-200 truncate max-w-[180px]">
              {c.serviceType === 'mobile'
                ? `${c.streetAddress}, ${c.city}`
                : 'Constant Clean Studio'}
            </span>
          </div>
        </div>
      </div>

      {booking.paymentStatus === 'pending' && method.handle && !isCancelled && (
        <div className="p-3 rounded-xl bg-[#050505] border border-yellow-300/30 text-[11px] text-zinc-300 flex items-start space-x-2">
          <Info className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
          <p>
            Send {formatCurrency(booking.totalPrice)} via {method.title} to{' '}
            <strong className="text-yellow-300 font-mono">{method.handle}</strong> with memo{' '}
            <strong className="font-mono text-white">{booking.id}</strong>.
          </p>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-white text-black text-center space-y-2">
        <Award className="w-16 h-16 mx-auto text-black" />
        <p className="text-[10px] font-mono font-bold tracking-widest uppercase">
          BOOKING-ID: {booking.id}
        </p>
        <p className="text-[10px] text-zinc-600 font-medium">
          Digital service certificate after completion
        </p>
      </div>

      <div className="space-y-2">
        <CancellationPolicy />
        {!isCancelled && (
          <button
            type="button"
            onClick={onCancel}
            disabled={!eligibility.allowed}
            className="w-full py-2.5 min-h-11 rounded-xl bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white font-semibold text-xs flex items-center justify-center space-x-2 border border-zinc-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#3a3a3a]"
          >
            <CalendarCheck className="w-4 h-4 text-lime-400" />
            <span>{eligibility.allowed ? 'Cancel Appointment' : eligibility.reason}</span>
          </button>
        )}
      </div>
    </div>
  );
}
