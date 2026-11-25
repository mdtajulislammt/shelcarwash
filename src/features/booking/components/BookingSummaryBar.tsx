import { useState } from 'react';
import { ArrowRight, ChevronDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/format';
import { useBookingSelection } from '../hooks/useBookingSelection';
import { Recurring } from './Recurring';

/**
 * "Total Price Estimate" bar. Sticky at the bottom of the services section, so it stays in view
 * while choosing vehicle, package and add-ons and comes to rest after the last step (it never
 * covers the footer). bottom-24 keeps it above the fixed bottom dock.
 * Mobile: price + button on top, details below, the recurring control collapsible.
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
  const [recurringOpen, setRecurringOpen] = useState(false);

  const badges = (
    <>
      <span className="text-xs px-2 py-0.5 rounded bg-surface-4/70 text-muted border border-card-border whitespace-nowrap">
        ~{totalDuration} mins
      </span>
      {isMaintenancePlan && (
        <span
          className={`text-xs px-2.5 py-0.5 rounded font-bold whitespace-nowrap ${
            isRecurring
              ? 'bg-brand text-ink'
              : 'bg-surface-4/70 text-muted border border-card-border'
          }`}
        >
          {isRecurring ? frequencyLabel : 'One-time'}
        </span>
      )}
    </>
  );

  return (
    <section
      aria-label="Booking summary"
      className="sticky bottom-24 z-30 p-4 sm:p-6 rounded-card bg-card/95 backdrop-blur-md border border-card-border shadow-card-sm sm:shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-6"
    >
      <span className="lg:hidden -mb-2 text-xs font-semibold text-muted">Total Price Estimate</span>
      <div className="flex items-center justify-between gap-3 lg:contents">
        <div className="min-w-0 lg:flex-1">
          <span className="hidden lg:block text-xs font-semibold text-muted">
            Total Price Estimate
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              data-testid="summary-total"
              aria-live="polite"
              className="text-3xl sm:text-4xl font-black text-white leading-tight"
            >
              {formatCurrency(totalPrice)}
            </span>
            <span className="hidden sm:flex items-center gap-2">{badges}</span>
          </div>
          <p data-testid="summary-details" className="hidden lg:block text-sm text-muted mt-1">
            {selectedPackage.name} • {vehicle.toUpperCase()} • {selectedAddOns.length} Add-ons
            {isRecurring ? ` • Reoccurring (${frequencyLabel})` : ''}
          </p>
        </div>

        <Button
          onClick={onContinue}
          className="shrink-0 lg:order-last px-4 sm:px-8 py-3.5 sm:py-4 min-h-12 rounded-xl text-sm sm:text-base shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>Schedule Appointment</span>
          <ArrowRight className="w-4 h-4 text-ink" />
        </Button>
      </div>

      <div className="lg:hidden flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
        <span className="sm:hidden flex items-center gap-2">{badges}</span>
        <span>
          {selectedPackage.name} • {vehicle.toUpperCase()} • {selectedAddOns.length} Add-ons
        </span>
      </div>

      {isMaintenancePlan && (
        <div className="lg:w-80 lg:shrink-0">
          <button
            type="button"
            aria-expanded={recurringOpen}
            aria-controls="summary-recurring"
            onClick={() => setRecurringOpen((o) => !o)}
            className="lg:hidden w-full min-h-11 px-3 rounded-xl border border-card-border bg-surface-4/60 flex items-center justify-between text-xs font-bold text-white"
          >
            <span className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${isRecurring ? 'text-brand' : 'text-muted'}`} />
              Reoccurring Cleanings:{' '}
              <span className={isRecurring ? 'text-brand' : 'text-muted'}>
                {isRecurring ? frequencyLabel : 'Off'}
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted transition-transform ${recurringOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            id="summary-recurring"
            className={`${recurringOpen ? 'block mt-2' : 'hidden'} lg:block lg:mt-0`}
          >
            <Recurring />
          </div>
        </div>
      )}
    </section>
  );
}
