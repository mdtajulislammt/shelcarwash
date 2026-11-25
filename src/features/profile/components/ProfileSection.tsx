import { useState } from 'react';
import { Mail, MapPin, Pencil, Phone, Trash2, UserRound } from 'lucide-react';
import { useClearProfile, useProfile } from '../hooks/useProfile';
import { EMPTY_PROFILE } from '../schemas';
import { formatProfileAddress } from '../utils';
import { ProfileEditModal } from './ProfileEditModal';

const BTN =
  'px-3.5 py-2 min-h-11 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors';

/** "My Bookings" profile card: view, edit and clear the saved profile. */
export function ProfileSection() {
  const { data: profile, isLoading } = useProfile();
  const clear = useClearProfile();
  const [editing, setEditing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (isLoading) return null;
  const address = profile ? formatProfileAddress(profile) : '';

  return (
    <section
      aria-labelledby="profile-heading"
      className="p-5 rounded-card bg-surface-4 border border-card-border flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2.5 rounded-xl bg-brand text-ink shrink-0">
          <UserRound className="w-5 h-5" />
        </div>
        <div className="min-w-0 space-y-1">
          <h3 id="profile-heading" className="text-sm font-extrabold text-white">
            {profile ? profile.fullName : 'Your Profile'}
          </h3>
          {profile ? (
            <ul className="text-xs text-muted space-y-0.5">
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                {profile.phone}
              </li>
              {profile.email && (
                <li className="flex items-center gap-1.5 min-w-0">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </li>
              )}
              <li className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{address || 'No service address saved'}</span>
              </li>
            </ul>
          ) : (
            <p className="text-xs text-muted">
              Saved automatically after your first booking, or add it now to book faster.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:justify-end shrink-0">
        {confirmClear ? (
          <>
            <span className="text-xs text-white font-semibold">Clear saved profile?</span>
            <button
              type="button"
              onClick={() => clear.mutate(undefined, { onSuccess: () => setConfirmClear(false) })}
              disabled={clear.isPending}
              className={`${BTN} bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50`}
            >
              Yes, clear
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className={`${BTN} bg-card hover:bg-card-hover text-white border border-card-border`}
            >
              Keep
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className={`${BTN} bg-brand hover:bg-brand-2 text-ink`}
            >
              <Pencil className="w-3.5 h-3.5" />
              {profile ? 'Edit' : 'Add Profile'}
            </button>
            {profile && (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className={`${BTN} bg-card hover:bg-card-hover text-white border border-card-border`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </>
        )}
      </div>

      {editing && (
        <ProfileEditModal initial={profile ?? EMPTY_PROFILE} onClose={() => setEditing(false)} />
      )}
    </section>
  );
}
