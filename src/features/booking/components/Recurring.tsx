import { RefreshCw } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { FREQUENCY_OPTIONS, useBookingSelection } from '../hooks/useBookingSelection';
import { SELECT_CARD } from './selectableStyles';

/** "Reoccurring Cleanings" switch + Weekly / Bi-Weekly / Monthly selector (maintenance packages). */
export function Recurring() {
  const { isRecurring, recurringFrequency, frequencyLabel } = useBookingSelection();
  const toggleRecurring = useBookingStore((s) => s.toggleRecurring);
  const setRecurringFrequency = useBookingStore((s) => s.setRecurringFrequency);

  return (
    <div className="px-3 py-2.5 rounded-xl border border-card-border bg-surface-4/60 flex flex-col items-stretch gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <RefreshCw
            className={`w-4 h-4 transition-transform duration-500 ${
              isRecurring ? 'text-brand rotate-180' : 'text-muted'
            }`}
          />
          <div className="text-left">
            <span id="recurring-label" className="text-xs font-extrabold text-white block">
              Reoccurring Cleanings
            </span>
            <span
              className={`text-[11px] font-semibold block leading-tight ${isRecurring ? 'text-brand' : 'text-muted'}`}
            >
              {isRecurring ? `${frequencyLabel} schedule ON` : 'One-time clean'}
            </span>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isRecurring}
          aria-labelledby="recurring-label"
          onClick={toggleRecurring}
          className={`relative after:absolute after:content-[''] after:-inset-2 inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors cursor-pointer ${
            isRecurring ? 'bg-brand' : 'bg-zinc-600'
          }`}
        >
          <span
            className={`pointer-events-none h-6 w-6 rounded-full shadow-md transition-transform duration-300 ${
              isRecurring ? 'translate-x-5 bg-ink' : 'translate-x-0 bg-white'
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Cleaning frequency">
        {FREQUENCY_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            aria-pressed={isRecurring && recurringFrequency === opt.id}
            onClick={() => setRecurringFrequency(opt.id)}
            className={`${SELECT_CARD} shadow-none! min-h-9 px-2.5 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
