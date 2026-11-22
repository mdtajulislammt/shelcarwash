import { formatDateString } from '@/lib/dates';
import { formatCurrency, formatSlotLabel } from '@/lib/format';
import type { AddOn, Customer, Package, RecurringFrequency, VehicleCategory } from '@/types';
import { CancellationPolicy } from '../CancellationPolicy';

interface ReviewProps {
  pkg: Package;
  addOns: AddOn[];
  vehicle: VehicleCategory;
  customer: Customer;
  date: string;
  slotId: string;
  totalPrice: number;
  isRecurring: boolean;
  recurringFrequency: RecurringFrequency;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="shrink-0">{label}</span>
      <span className="text-zinc-200 font-medium text-right">{value}</span>
    </div>
  );
}

/** Order summary + cancellation policy shown before payment. */
export function Review(props: ReviewProps) {
  const { pkg, addOns, vehicle, customer, date, slotId, totalPrice } = props;
  const location =
    customer.serviceType === 'mobile'
      ? `${customer.streetAddress}, ${customer.city} ${customer.zipCode}`
      : 'Studio Drop-off';

  return (
    <div className="space-y-3">
      <div className="p-4 rounded-2xl bg-[#050505] border border-zinc-800 space-y-3">
        <div className="flex justify-between items-center gap-3 text-sm font-bold border-b border-zinc-800 pb-2">
          <span className="text-zinc-200">{pkg.name}</span>
          <span className="text-yellow-300 font-extrabold">{formatCurrency(totalPrice)}</span>
        </div>
        <div className="text-xs text-zinc-400 space-y-1">
          <Row
            label="Vehicle:"
            value={`${customer.vehicleMake} ${customer.vehicleModel} (${vehicle.toUpperCase()})`}
          />
          <Row
            label="Appointment:"
            value={`${formatDateString(date)} @ ${formatSlotLabel(slotId)}`}
          />
          <Row label="Location:" value={location} />
          {addOns.length > 0 && (
            <Row label="Add-ons:" value={addOns.map((a) => a.name).join(', ')} />
          )}
          {props.isRecurring && <Row label="Reoccurring:" value={props.recurringFrequency} />}
        </div>
      </div>
      <CancellationPolicy />
    </div>
  );
}
