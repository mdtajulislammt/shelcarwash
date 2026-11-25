import { useState, type FormEvent } from 'react';
import { Settings } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { ProfileFormFields } from '@/features/profile/components/ProfileFormFields';
import { useSaveProfile } from '@/features/profile/hooks/useProfile';
import { useProfileForm } from '@/features/profile/hooks/useProfileForm';
import type { Profile } from '@/features/profile/schemas';
import type { AccountSettings } from '../schemas';
import { useUpdateAccountSettings } from '../hooks/useAccountData';

interface SettingsModalProps {
  onClose: () => void;
  initialProfile: Profile;
  initialSettings: AccountSettings;
  email: string;
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 p-3 rounded-xl bg-page border border-zinc-800 cursor-pointer min-h-11">
      <span>
        <span className="block text-xs font-bold text-white">{label}</span>
        <span className="block text-[11px] text-zinc-400">{hint}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-brand shrink-0"
      />
    </label>
  );
}

/**
 * Account settings: profile (contact + default service address, shared with the booking form)
 * and notification preferences. Mount only while open so the form starts from the saved values.
 */
export function SettingsModal({
  onClose,
  initialProfile,
  initialSettings,
  email,
}: SettingsModalProps) {
  const profileForm = useProfileForm(initialProfile);
  const saveProfile = useSaveProfile();
  const saveSettings = useUpdateAccountSettings();
  const [settings, setSettings] = useState(initialSettings);
  const isPending = saveProfile.isPending || saveSettings.isPending;
  const error = saveProfile.error ?? saveSettings.error;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const profile = profileForm.validate();
    if (!profile) return;
    try {
      await Promise.all([saveProfile.mutateAsync(profile), saveSettings.mutateAsync(settings)]);
      onClose();
    } catch {
      // Shown below via `error`.
    }
  };

  return (
    <Modal open onClose={onClose} labelledBy="settings-title">
      <div className="flex items-center space-x-2.5 border-b border-zinc-800 pb-4 pr-12">
        <div className="p-2 rounded-xl bg-brand text-ink">
          <Settings className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 id="settings-title" className="text-base font-extrabold text-white">
            Account Settings
          </h3>
          <p className="text-xs text-zinc-400 font-mono truncate">{email}</p>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="space-y-3">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
            Profile & Default Service Address
          </h4>
          <ProfileFormFields state={profileForm} />
          <p className="text-[11px] text-zinc-400">
            Pre-filled when you book. Leave the address empty if you prefer studio drop-off.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
            Notifications
          </h4>
          <Toggle
            label="SMS reminders"
            hint="Day-before reminder and “on the way” text"
            checked={settings.smsReminders}
            onChange={(v) => setSettings((s) => ({ ...s, smsReminders: v }))}
          />
          <Toggle
            label="Email updates"
            hint="Booking confirmations and service certificates"
            checked={settings.emailUpdates}
            onChange={(v) => setSettings((s) => ({ ...s, emailUpdates: v }))}
          />
        </div>

        {error && <p className="text-xs text-rose-400">{error.message}</p>}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 min-h-11 rounded-xl bg-card hover:bg-card-hover border border-card-border text-white font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 min-h-11 rounded-xl bg-brand hover:bg-brand-2 text-ink font-extrabold text-xs disabled:opacity-50"
          >
            {isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
