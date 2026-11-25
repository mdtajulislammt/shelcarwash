import { useState } from 'react';
import { AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { CANCELLATION_POLICY } from '@/config/site';
import { formatCurrency } from '@/lib/format';
import type { Booking, PaymentMethod } from '@/types';
import { useBookingSelection } from '../../hooks/useBookingSelection';
import { useCreateBooking } from '../../hooks/useCreateBooking';
import { useBookingStore } from '../../store/bookingStore';
import { Confirmation } from './Confirmation';
import { Payment } from './Payment';
import { getPaymentMethodOption } from './paymentMethods';
import { Review } from './Review';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onDone: (booking: Booking) => void;
}

/** Review → Payment → Confirmation. */
export function CheckoutModal({ open, onClose, onDone }: CheckoutModalProps) {
  const sel = useBookingSelection();
  const customer = useBookingStore((s) => s.customer);
  const date = useBookingStore((s) => s.date);
  const slotId = useBookingStore((s) => s.slotId);
  const [method, setMethod] = useState<PaymentMethod>('card');
  const createBooking = useCreateBooking();
  const booking = createBooking.data;

  const handleClose = () => {
    if (createBooking.isPending) return;
    if (booking) onDone(booking);
    else {
      createBooking.reset();
      onClose();
    }
  };

  const handlePay = () => {
    if (!slotId) return;
    createBooking.mutate({
      serviceId: sel.selectedPackage.id,
      vehicleCategory: sel.vehicle,
      addonIds: sel.selectedAddOns.map((a) => a.id),
      date,
      slotId,
      customer,
      paymentMethod: method,
      isRecurring: sel.isRecurring,
      recurringFrequency: sel.isRecurring ? sel.recurringFrequency : null,
    });
  };

  const option = getPaymentMethodOption(method);
  const amount = formatCurrency(sel.totalPrice);

  return (
    <Modal open={open} onClose={handleClose} labelledBy="checkout-title">
      {booking ? (
        <Confirmation booking={booking} onDone={() => onDone(booking)} />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pr-12">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-zinc-700 flex items-center justify-center p-2 shadow-lg shadow-brand/10 shrink-0">
              <Lock className="w-6 h-6 text-brand" />
            </div>
            <div>
              <h3 id="checkout-title" className="text-xl font-extrabold text-white">
                Review & Secure Checkout
              </h3>
              <p className="text-xs text-zinc-400">
                Prepaid booking • Instant booking confirmation
              </p>
            </div>
          </div>

          {slotId && (
            <Review
              pkg={sel.selectedPackage}
              addOns={sel.selectedAddOns}
              vehicle={sel.vehicle}
              customer={customer}
              date={date}
              slotId={slotId}
              totalPrice={sel.totalPrice}
              isRecurring={sel.isRecurring}
              recurringFrequency={sel.recurringFrequency}
            />
          )}

          <Payment method={method} onChange={setMethod} amount={sel.totalPrice} />

          {createBooking.error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{createBooking.error.message}</span>
            </div>
          )}

          <Button
            variant="dark"
            onClick={handlePay}
            disabled={createBooking.isPending || !slotId}
            className="w-full py-4 rounded-2xl text-base shadow-xl flex items-center justify-center space-x-3 transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            {createBooking.isPending ? (
              <>
                <Spinner />
                <span>Processing…</span>
              </>
            ) : option.kind === 'instant' ? (
              <span>Pay now {amount}</span>
            ) : (
              <span>
                Confirm booking • Pay {amount} via {option.title}
              </span>
            )}
          </Button>

          <div className="flex items-center justify-center space-x-2 text-[11px] text-zinc-400">
            <Lock className="w-3.5 h-3.5 text-lime-400 shrink-0" />
            <span>{CANCELLATION_POLICY.short}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
