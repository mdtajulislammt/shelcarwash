import { CheckCircle2, Info, Wallet } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useWalletSaveLink } from '../hooks/useWalletSaveLink';
import type { CustomerPass } from '../utils/passes';

interface WalletModalProps {
  passes: CustomerPass[] | null;
  onClose: () => void;
}

/**
 * "Add to Google Wallet": asks the backend for a signed save link and opens it. Google then
 * shows its own "Save to Wallet" screen. Mock mode has no issuer account, so it explains that.
 */
export function WalletModal({ passes, onClose }: WalletModalProps) {
  const save = useWalletSaveLink();
  const unavailable = save.isSuccess && !save.data.saveUrl;

  const close = () => {
    save.reset();
    onClose();
  };

  const add = () => {
    if (!passes) return;
    save.mutate(
      passes.map((p) => p.id),
      {
        onSuccess: ({ saveUrl }) => {
          if (saveUrl) window.location.assign(saveUrl);
        },
      },
    );
  };

  return (
    <Modal open={!!passes} onClose={close} labelledBy="wallet-title">
      <div className="flex items-center space-x-2.5 border-b border-zinc-800 pb-4 pr-12">
        <div className="p-2 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <h3 id="wallet-title" className="text-base font-extrabold text-white">
            Add to Google Wallet
          </h3>
          <p className="text-xs text-zinc-400">
            Keep your passes on your phone — they update automatically
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {(passes ?? []).map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#050505] border border-zinc-800 text-xs"
          >
            <span className="min-w-0">
              <span className="block font-extrabold text-white truncate">{p.title}</span>
              <span className="block text-zinc-400 font-mono truncate">
                {p.brand} · {p.code}
              </span>
            </span>
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
          </li>
        ))}
      </ul>

      {unavailable && (
        <p className="flex items-start space-x-2 text-[11px] text-lime-300 bg-lime-950/40 border border-lime-500/30 rounded-lg px-3 py-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Demo mode — Google Wallet passes are issued by the Constant Clean server (Google Wallet
            API). This button opens Google&apos;s “Save to Wallet” screen once the backend is
            connected.
          </span>
        </p>
      )}
      {save.error && <p className="text-xs text-rose-400">{save.error.message}</p>}

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
        <button
          type="button"
          onClick={close}
          className="px-5 py-2.5 min-h-11 rounded-xl bg-[#3a3a3a] hover:bg-[#4a4a4a] border border-zinc-600 text-white font-semibold text-xs"
        >
          {unavailable ? 'Close' : 'Cancel'}
        </button>
        {!unavailable && (
          <button
            type="button"
            onClick={add}
            disabled={save.isPending}
            className="px-5 py-2.5 min-h-11 rounded-xl bg-black hover:bg-zinc-900 border border-zinc-600 text-white font-extrabold text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Wallet className="w-4 h-4" />
            <span>{save.isPending ? 'Preparing…' : 'Add to Google Wallet'}</span>
          </button>
        )}
      </div>
    </Modal>
  );
}
