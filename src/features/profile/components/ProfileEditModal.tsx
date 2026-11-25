import { type FormEvent } from 'react';
import { UserRound } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useSaveProfile } from '../hooks/useProfile';
import { useProfileForm } from '../hooks/useProfileForm';
import type { Profile } from '../schemas';
import { ProfileFormFields } from './ProfileFormFields';

interface ProfileEditModalProps {
  initial: Profile;
  onClose: () => void;
}

/** Edit the saved profile. Mount it only while open so the form starts from `initial`. */
export function ProfileEditModal({ initial, onClose }: ProfileEditModalProps) {
  const form = useProfileForm(initial);
  const save = useSaveProfile();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const profile = form.validate();
    if (profile) save.mutate(profile, { onSuccess: onClose });
  };

  return (
    <Modal open onClose={onClose} labelledBy="profile-edit-title">
      <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-4 pr-12">
        <div className="p-2 rounded-xl bg-brand text-ink">
          <UserRound className="w-5 h-5" />
        </div>
        <div>
          <h3 id="profile-edit-title" className="text-base font-extrabold text-white">
            Your Profile
          </h3>
          <p className="text-xs text-muted">Pre-fills your next booking on this device.</p>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="space-y-5">
        <ProfileFormFields state={form} />
        {save.error && <p className="text-xs text-rose-400">{save.error.message}</p>}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 min-h-11 rounded-xl bg-card hover:bg-card-hover border border-card-border text-white font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={save.isPending}
            className="px-5 py-2.5 min-h-11 rounded-xl bg-brand hover:bg-brand-2 text-ink font-extrabold text-xs disabled:opacity-50"
          >
            {save.isPending ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
