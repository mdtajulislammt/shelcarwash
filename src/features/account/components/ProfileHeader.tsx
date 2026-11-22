import { Check, LogOut, Settings, ShieldCheck, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AccountProfile } from '../utils/profile';
import { ProfileAvatar } from './ProfileAvatar';

interface ProfileHeaderProps {
  profile: AccountProfile;
  isVerified: boolean;
  bookingCount: number;
  onOpenSettings: () => void;
  onSignOut: () => void;
}

const SECONDARY =
  'px-4 py-2 min-h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-yellow-400 hover:text-yellow-300 border border-zinc-700 font-extrabold text-xs transition-all shadow-md flex items-center space-x-2 shrink-0 cursor-pointer';

/** Top banner: customer name, contact and account status. */
export function ProfileHeader({
  profile,
  isVerified,
  bookingCount,
  onOpenSettings,
  onSignOut,
}: ProfileHeaderProps) {
  return (
    <div className="bg-[#18181c] border border-zinc-800 rounded-2xl p-5 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="flex items-center space-x-4 min-w-0">
        <div className="relative shrink-0">
          <ProfileAvatar
            name={profile.fullName}
            className="w-14 h-14 text-lg ring-2 ring-yellow-400 shadow-md"
          />
          {isVerified && (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-lime-400 border-2 border-[#18181c] flex items-center justify-center text-black">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-extrabold text-white truncate">{profile.fullName}</h2>
            <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-[10px] font-bold uppercase tracking-wider">
              Customer Account
            </span>
          </div>
          <p className="text-zinc-400 text-xs font-mono mt-0.5 truncate">
            {profile.email || profile.phone}
          </p>
          <div
            className={`flex items-center space-x-2 mt-1 text-[11px] font-medium ${isVerified ? 'text-lime-400' : 'text-zinc-400'}`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isVerified ? 'Verified & Signed In' : 'Remembered on this device'} · {bookingCount}{' '}
              booking{bookingCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
        <Link
          to="/passes"
          className="px-4 py-2 min-h-11 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-all shadow-md flex items-center space-x-2 shrink-0"
        >
          <Ticket className="w-4 h-4" />
          <span>My Passes</span>
        </Link>
        <button type="button" onClick={onOpenSettings} className={SECONDARY}>
          <Settings className="w-4 h-4 text-yellow-400" />
          <span>Settings</span>
        </button>
        <button type="button" onClick={onSignOut} aria-label="Sign out" className={SECONDARY}>
          <LogOut className="w-4 h-4 text-yellow-400" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
