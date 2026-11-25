import { useCallback, useState } from 'react';
import { CheckCircle2, Info, Wallet } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/format';
import { SELECT_CARD } from '../selectableStyles';
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
  const [toast, setToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

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
              className={`${SELECT_CARD} w-full text-left p-3.5 cursor-pointer flex items-center justify-between`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-card-chip text-card-chip-fg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-card-fg block truncate">{opt.title}</span>
                  <span className="text-[11px] text-card-muted block mt-0.5">{opt.subtitle}</span>
                </div>
              </div>
              {isSelected && <CheckCircle2 className="w-4 h-4 text-ink shrink-0 ml-2" />}
            </button>
          );
        })}
      </div>

      {/* TODO(backend): issue the booking as a Google Wallet pass — the server signs a save link
          with the Google Wallet API issuer account; open it here. UI only for now. */}
      <button
        type="button"
        onClick={() => setToast('Google Wallet — coming soon')}
        className="w-full min-h-11 px-4 py-2.5 rounded-xl bg-ink hover:bg-surface-4 border border-card-border text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
      >
        <Wallet className="w-4 h-4 text-brand" />
        <span>Connect to Google Wallet</span>
      </button>
      <Toast message={toast} onDismiss={dismissToast} />

      <div className="p-3 rounded-xl bg-page border border-zinc-800 text-[11px] text-zinc-300 flex items-start space-x-2">
        <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
        {active.kind === 'manual' ? (
          <p>
            Send <strong className="text-white">{formatCurrency(amount)}</strong> via {active.title}{' '}
            to <strong className="text-brand font-mono">{active.handle}</strong> and include your
            booking ID in the memo. Your booking shows{' '}
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
