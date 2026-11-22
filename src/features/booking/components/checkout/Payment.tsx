import { CheckCircle2, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import type { PaymentMethod } from '@/types';
import { PAYMENT_METHOD_OPTIONS, getPaymentMethodOption } from './paymentMethods';

interface PaymentProps {
  method: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  amount: number;
}

/** Payment method picker. Every booking is prepaid. */
export function Payment({ method, onChange, amount }: PaymentProps) {
  const active = getPaymentMethodOption(method);

  return (
    <div className="space-y-3">
      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
        Select Payment Method:
      </span>

      <div className="space-y-2.5" role="radiogroup" aria-label="Payment method">
        {PAYMENT_METHOD_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = method === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(opt.id)}
              className={`w-full text-left p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                isSelected
                  ? 'bg-zinc-800 border-yellow-300 ring-1 ring-yellow-300/30'
                  : 'bg-[#050505] border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#0a0a0d] border border-zinc-700 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">{opt.title}</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">{opt.subtitle}</span>
                </div>
              </div>
              {isSelected && <CheckCircle2 className="w-4 h-4 text-yellow-300 shrink-0 ml-2" />}
            </button>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-[#050505] border border-zinc-800 text-[11px] text-zinc-300 flex items-start space-x-2">
        <Info className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
        {active.kind === 'manual' ? (
          <p>
            Send <strong className="text-white">{formatCurrency(amount)}</strong> via {active.title}{' '}
            to <strong className="text-yellow-300 font-mono">{active.handle}</strong> and include
            your booking ID in the memo. Your booking shows{' '}
            <strong className="text-white">Pending payment</strong> until we confirm it.
          </p>
        ) : (
          <p>
            Demo checkout — no card is charged. Secure card and Google Pay processing via Stripe
            will be enabled in the backend phase.
          </p>
        )}
      </div>
    </div>
  );
}
