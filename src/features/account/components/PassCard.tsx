import { Award, CalendarCheck, Repeat, Wallet } from 'lucide-react';
import type { CustomerPass } from '../utils/passes';

const ICONS = { booking: CalendarCheck, plan: Repeat, certificate: Award };

/** Original wallet-card look: gradient card, brand row, title, code + status. */
export function PassCard({
  pass,
  onAddToWallet,
}: {
  pass: CustomerPass;
  onAddToWallet: () => void;
}) {
  const Icon = ICONS[pass.kind];
  return (
    <div
      className={`p-4 rounded-xl bg-gradient-to-br ${pass.bgColor} border border-white/10 shadow-lg flex flex-col justify-between h-36 text-white relative overflow-hidden`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-1.5">
          <Icon className="w-4 h-4 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
            {pass.brand}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {pass.isNext && (
            <span className="px-1.5 py-0.5 rounded bg-yellow-400 text-black font-extrabold text-[9px]">
              NEXT
            </span>
          )}
          <button
            type="button"
            onClick={onAddToWallet}
            aria-label={`Add ${pass.title} to Google Wallet`}
            title="Add to Google Wallet"
            className="relative p-1 rounded-md bg-black/30 hover:bg-black/50 border border-white/20 after:absolute after:-inset-2.5 after:content-['']"
          >
            <Wallet className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs font-extrabold truncate">{pass.title}</p>
        <div className="flex items-center justify-between gap-2 mt-1 text-[11px] opacity-90">
          <span className="font-mono truncate">{pass.code}</span>
          <span className="font-bold whitespace-nowrap">{pass.detail}</span>
        </div>
      </div>
    </div>
  );
}
