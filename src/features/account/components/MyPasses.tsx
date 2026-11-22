import { useState } from 'react';
import { Calendar, CheckCircle2, Plus, Ticket, Wallet } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { useLookupStore } from '@/features/bookings/store/lookupStore';
import { todayInBusinessTz } from '@/lib/dates';
import { useAccount } from '../hooks/useAccount';
import { buildPasses, type CustomerPass } from '../utils/passes';
import { AccountLookup } from './AccountLookup';
import { PassCard } from './PassCard';
import { ProfileAvatar } from './ProfileAvatar';
import { WalletModal } from './WalletModal';

/** "My Passes" — booking passes, maintenance plans and service certificates (wallet-card design). */
export function MyPasses({ onBook }: { onBook: () => void }) {
  const { lookup, profile, bookings, isLoading, error } = useAccount();
  const clearLookup = useLookupStore((s) => s.clearLookup);
  const [walletPasses, setWalletPasses] = useState<CustomerPass[] | null>(null);

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center" aria-live="polite">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-6 space-y-4">
        {error && <p className="text-xs text-rose-400 text-center">{error.message}</p>}
        <AccountLookup
          title="My Passes"
          description="Sign in to see your booking passes and service certificates."
          notFoundFor={lookup?.email ?? lookup?.phone ?? null}
          onSignOut={clearLookup}
          onBook={onBook}
        />
      </div>
    );
  }

  const passes = buildPasses(bookings, todayInBusinessTz());

  return (
    <div className="py-6">
      <div className="bg-[#18181c] rounded-3xl border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#0a0a0d] border border-zinc-700 flex items-center justify-center p-2 shadow-lg shadow-yellow-400/10">
              <Ticket className="w-7 h-7 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">My Passes</h3>
              <p className="text-xs text-zinc-400">
                Booking passes, maintenance plans & digital service certificates
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            {passes.length > 0 && (
              <button
                type="button"
                onClick={() => setWalletPasses(passes)}
                className="px-4 py-2.5 min-h-11 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-all shadow-md flex items-center space-x-2 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Connect Google Wallet</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBook}
              className="px-4 py-2.5 min-h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-yellow-400 border border-zinc-700 font-extrabold text-xs transition-all shadow-md flex items-center space-x-2 shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Detail</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pass Holder</h4>
          <div className="max-w-xl p-5 rounded-2xl bg-[#0a0a0d] border border-zinc-800 space-y-4">
            <div className="flex items-center space-x-3 min-w-0">
              <ProfileAvatar
                name={profile.fullName}
                className="w-12 h-12 text-sm ring-2 ring-yellow-400"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-extrabold text-white truncate">
                    {profile.email}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[9px] font-extrabold uppercase tracking-wider">
                    Customer
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Status: <span className="text-lime-400 font-bold">Active</span> •{' '}
                  {bookings.length} booking{bookings.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center space-x-1.5 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span>Passes update automatically after each booking</span>
              </span>
              <button
                type="button"
                onClick={clearLookup}
                className="relative text-[11px] font-bold text-zinc-400 hover:text-white shrink-0 after:absolute after:-inset-3 after:content-['']"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800/80 space-y-4">
          <div className="flex items-center space-x-2">
            <Ticket className="w-5 h-5 text-yellow-300" />
            <h4 className="text-sm font-extrabold text-white">Passes ({passes.length})</h4>
            <span className="text-[11px] text-zinc-500 hidden sm:flex items-center space-x-1">
              <Wallet className="w-3.5 h-3.5" />
              <span>tap the wallet icon to save a pass</span>
            </span>
          </div>

          {passes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {passes.map((pass) => (
                <PassCard key={pass.id} pass={pass} onAddToWallet={() => setWalletPasses([pass])} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0a0a0d] border border-zinc-800 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto shadow-inner">
                <Ticket className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white">No active passes</p>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Book a detail to get a booking pass. A service certificate is added after each
                completed detail.
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">
            Ready to schedule your vehicle detailing? Your booking pass is created the moment you
            check out.
          </p>
          <button
            type="button"
            onClick={onBook}
            className="w-full sm:w-auto px-6 py-3 min-h-11 rounded-xl bg-gradient-to-r from-yellow-400 via-lime-300 to-lime-400 hover:from-yellow-300 hover:to-lime-300 text-black font-extrabold text-xs transition-all shadow-lg shadow-yellow-400/20 flex items-center justify-center space-x-2 shrink-0"
          >
            <Calendar className="w-4 h-4 text-black" />
            <span>Schedule Detailing Service</span>
          </button>
        </div>
      </div>
      <WalletModal passes={walletPasses} onClose={() => setWalletPasses(null)} />
    </div>
  );
}
