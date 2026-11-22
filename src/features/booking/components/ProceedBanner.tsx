import { ArrowRight, Loader2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDateString } from '@/lib/dates';
import { formatCurrency, formatSlotLabel } from '@/lib/format';
import type { RecurringFrequency } from '@/types';

interface ProceedBannerProps {
  totalPrice: number;
  date: string;
  slotId: string | null;
  isRecurring: boolean;
  recurringFrequency: RecurringFrequency;
  isChecking: boolean;
}

export function ProceedBanner({
  totalPrice,
  date,
  slotId,
  isRecurring,
  recurringFrequency,
  isChecking,
}: ProceedBannerProps) {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-[#18181c] via-[#121216] to-[#18181c] border border-yellow-300/30 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-xl bg-lime-400/10 text-lime-400 shrink-0">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">
            <span>Next Step: Secure Payment ({formatCurrency(totalPrice)})</span>
            {isRecurring && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-slate-200 via-zinc-300 to-slate-400 text-black border border-white/80 capitalize">
                Reoccurring Cleanings • {recurringFrequency}
              </span>
            )}
          </div>
          <div className="text-xs text-zinc-300 mt-0.5">
            {slotId ? (
              <>
                Scheduled for{' '}
                <strong className="text-yellow-300">
                  {formatDateString(date)} at {formatSlotLabel(slotId)}
                </strong>
                . You'll get a booking confirmation right after checkout.
              </>
            ) : (
              <>Select an available time slot to continue.</>
            )}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isChecking}
        className="w-full sm:w-auto shrink-0 px-8 py-3.5 rounded-xl text-sm shadow-xl shadow-yellow-300/20 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-60"
      >
        <span>Proceed to Payment</span>
        {isChecking ? (
          <Loader2 className="w-4 h-4 text-black animate-spin" />
        ) : (
          <ArrowRight className="w-4 h-4 text-black" />
        )}
      </Button>
    </div>
  );
}
