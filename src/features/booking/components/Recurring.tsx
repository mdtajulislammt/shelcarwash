import { RefreshCw } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { FREQUENCY_OPTIONS, useBookingSelection } from '../hooks/useBookingSelection';
import { onActivateKey } from './selectableStyles';

/** Metallic toggle + Weekly / Bi-Weekly / Monthly selector (maintenance packages only). */
export function Recurring() {
  const { isRecurring, recurringFrequency, frequencyLabel } = useBookingSelection();
  const toggleRecurring = useBookingStore((s) => s.toggleRecurring);
  const setRecurringFrequency = useBookingStore((s) => s.setRecurringFrequency);

  return (
    <div className="flex items-center justify-center">
      <div
        onClick={toggleRecurring}
        onKeyDown={onActivateKey(toggleRecurring)}
        className={`cursor-pointer select-none px-4 py-2.5 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 shadow-inner ${
          isRecurring
            ? 'bg-gradient-to-b from-[#34363c] via-[#25272c] to-[#1b1c20] border-yellow-300/60 shadow-[0_0_18px_rgba(253,224,71,0.2)]'
            : 'bg-gradient-to-b from-[#2b2c30] via-[#212226] to-[#18191c] border-zinc-500/60 hover:border-zinc-300/70'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <RefreshCw
              className={`w-4 h-4 transition-transform duration-500 ${
                isRecurring ? 'text-yellow-300 rotate-180' : 'text-zinc-400'
              }`}
            />
            <div className="text-left">
              <span className="text-xs font-extrabold tracking-wide bg-gradient-to-r from-white via-slate-200 to-zinc-300 bg-clip-text text-transparent block leading-tight">
                Reoccurring Cleanings
              </span>
              <span
                className={`text-[10px] font-semibold block leading-tight ${isRecurring ? 'text-yellow-300' : 'text-zinc-400'}`}
              >
                {isRecurring ? `${frequencyLabel} schedule ON` : 'One-time clean'}
              </span>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isRecurring}
            aria-label="Reoccurring Cleanings"
            onClick={(e) => {
              e.stopPropagation();
              toggleRecurring();
            }}
            className={`relative after:absolute after:content-[''] after:-inset-2 inline-flex h-7 w-14 shrink-0 items-center rounded-full border p-0.5 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-300/70 ${
              isRecurring
                ? 'bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400 border-yellow-200 shadow-[0_0_18px_rgba(253,224,71,0.85),inset_0_1px_2px_rgba(255,255,255,0.9)]'
                : 'bg-gradient-to-b from-zinc-600 via-zinc-500 to-zinc-700 border-zinc-400/70 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]'
            }`}
          >
            <span
              className={`pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white/95 bg-gradient-to-br from-white via-slate-200 to-zinc-400 shadow-[0_2px_6px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,1)] transition-transform duration-300 ${
                isRecurring ? 'translate-x-7' : 'translate-x-0'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-zinc-300 via-slate-100 to-zinc-400 border border-zinc-400/50 shadow-inner" />
            </span>
          </button>
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-1.5 bg-[#121215] p-1 rounded-lg border border-zinc-700/80 w-full justify-center"
        >
          {FREQUENCY_OPTIONS.map((opt) => {
            const isActive = recurringFrequency === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setRecurringFrequency(opt.id)}
                className={`relative after:absolute after:content-[''] after:-inset-y-2.5 after:-inset-x-0.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-yellow-300 text-black shadow-sm shadow-yellow-300/40'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
