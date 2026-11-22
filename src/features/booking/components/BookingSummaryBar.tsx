import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/format';
import { useBookingSelection } from '../hooks/useBookingSelection';
import { Recurring } from './Recurring';

/**
 * Sticky price summary + CTA. Sits above the fixed bottom dock
 * (bottom-24 ≈ dock height + gap) so the dock never covers the button.
 */
export function BookingSummaryBar({ onContinue }: { onContinue: () => void }) {
  const {
    selectedPackage,
    selectedAddOns,
    vehicle,
    isMaintenancePlan,
    isRecurring,
    frequencyLabel,
    totalPrice,
    totalDuration,
  } = useBookingSelection();

  return (
    <div className="sticky bottom-24 z-30 p-4 sm:p-5 rounded-2xl bg-[#3a3a3a]/95 backdrop-blur-md border border-zinc-700 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
      <div className="w-full lg:w-auto text-center lg:text-left">
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
          <span className="text-xs text-zinc-400">Total Price Estimate:</span>
          <span className="text-2xl font-black text-white">{formatCurrency(totalPrice)}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
            ~{totalDuration} mins
          </span>
          {isMaintenancePlan && (
            <span
              className={`text-xs px-2.5 py-0.5 rounded font-bold border transition-colors ${
                isRecurring
                  ? 'bg-yellow-300/20 text-yellow-300 border-yellow-300/60 shadow-sm shadow-yellow-300/15'
                  : 'bg-zinc-800 text-zinc-200 border-zinc-600'
              }`}
            >
              {frequencyLabel}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-400 mt-0.5">
          {selectedPackage.name} • {vehicle.toUpperCase()} • {selectedAddOns.length} Add-ons
          {isRecurring ? ` • Reoccurring (${frequencyLabel})` : ''}
        </p>
      </div>

      {isMaintenancePlan && <Recurring />}

      <Button
        onClick={onContinue}
        className="w-full lg:w-auto px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-yellow-300/20 transition-all flex items-center justify-center space-x-2 active:scale-95"
      >
        <span>Schedule Appointment</span>
        <ArrowRight className="w-4 h-4 text-black" />
      </Button>
    </div>
  );
}
