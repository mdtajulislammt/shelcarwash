import { CalendarCheck, CheckCircle2, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDateString } from '@/lib/dates';
import { formatCurrency, formatSlotLabel } from '@/lib/format';
import type { Booking } from '@/types';
import { CancellationPolicy } from '../CancellationPolicy';
import { getPaymentMethodOption } from './paymentMethods';
import { PaymentStatusBadge } from '../PaymentStatusBadge';

export function Confirmation({ booking, onDone }: { booking: Booking; onDone: () => void }) {
  const isPaid = booking.paymentStatus === 'paid';
  const method = getPaymentMethodOption(booking.paymentMethod);
  const c = booking.customer;

  return (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30 flex items-center justify-center mx-auto animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <span
          className={`text-xs font-bold uppercase tracking-widest ${isPaid ? 'text-lime-400' : 'text-brand'}`}
        >
          {isPaid ? 'Payment Authorized & Confirmed' : 'Booking Received • Pending Payment'}
        </span>
        <h3 id="checkout-title" className="text-2xl font-extrabold text-white mt-1">
          Your Appointment Is Scheduled!
        </h3>
        <p className="text-xs text-zinc-300 mt-1">
          Booking ID: <span className="font-mono text-brand">{booking.id}</span>
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-surface-4 via-surface-3 to-surface-4 border border-brand/40 text-left space-y-3">
        <div className="flex justify-between items-center gap-2 border-b border-zinc-800 pb-2">
          <div className="flex items-center space-x-2">
            <CalendarCheck className="w-4 h-4 text-lime-400" />
            <span className="text-xs font-bold uppercase text-white">Booking Confirmation</span>
          </div>
          <PaymentStatusBadge status={booking.paymentStatus} />
        </div>

        <div className="text-xs text-zinc-200 space-y-1">
          <p className="font-bold text-white text-sm">{booking.service.name}</p>
          <p className="text-zinc-400">
            {c.vehicleYear} {c.vehicleMake} {c.vehicleModel} ({c.licensePlate})
          </p>
          <p className="text-brand font-bold">
            {formatDateString(booking.date)} @ {formatSlotLabel(booking.slotId)}
          </p>
          <p className="text-zinc-400">
            {formatCurrency(booking.totalPrice)} • {method.title}
          </p>
        </div>

        {!isPaid && method.handle && (
          <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-300 flex items-start space-x-2">
            <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <p>
              Send {formatCurrency(booking.totalPrice)} via {method.title} to{' '}
              <strong className="text-brand font-mono">{method.handle}</strong> with memo{' '}
              <strong className="font-mono text-white">{booking.id}</strong>.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-page border border-zinc-800 text-left space-y-2 text-xs text-zinc-300">
        <p>
          Booking confirmation for <strong className="text-white">{c.email}</strong>.
        </p>
        <p>Digital service certificate after completion.</p>
      </div>

      <CancellationPolicy className="text-left" />

      <Button
        onClick={onDone}
        className="w-full py-3.5 rounded-2xl text-sm shadow-lg shadow-brand/20 transition-all"
      >
        Done & View My Bookings
      </Button>
    </div>
  );
}
