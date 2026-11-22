import { useState, type FormEvent } from 'react';
import { Building2, Settings } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { SERVICE_AREA_CITIES, SERVICE_AREA_ERROR } from '@/config/site';
import { toFieldErrors } from '@/features/booking/schemas';
import { checkServiceArea } from '@/features/booking/utils/serviceArea';
import { accountSettingsSchema, type AccountSettings } from '../schemas';
import { useUpdateAccountSettings } from '../hooks/useAccountData';

type Field = keyof AccountSettings;

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  initial: AccountSettings;
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
    <label className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#050505] border border-zinc-800 cursor-pointer min-h-11">
      <span>
        <span className="block text-xs font-bold text-white">{label}</span>
        <span className="block text-[11px] text-zinc-400">{hint}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-yellow-400 shrink-0"
      />
    </label>
  );
}

/** Account settings: contact details, default service address, notifications. */
export function SettingsModal({ open, onClose, initial, email }: SettingsModalProps) {
  const save = useUpdateAccountSettings();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const set = <K extends Field>(field: K, value: AccountSettings[K]) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const close = () => {
    save.reset();
    setErrors({});
    setForm(initial);
    onClose();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = accountSettingsSchema.safeParse(form);
    if (!parsed.success) return setErrors(toFieldErrors<Field>(parsed.error));
    save.mutate(parsed.data, { onSuccess: onClose });
  };

  return (
    <Modal open={open} onClose={close} labelledBy="settings-title">
      <div className="flex items-center space-x-2.5 border-b border-zinc-800 pb-4 pr-12">
        <div className="p-2 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
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
            Contact
          </h4>
          <Input
            label="Full Name *"
            value={form.fullName}
            error={errors.fullName}
            autoComplete="name"
            onChange={(e) => set('fullName', e.target.value)}
          />
          <Input
            label="Phone Number *"
            type="tel"
            value={form.phone}
            error={errors.phone}
            autoComplete="tel"
            onChange={(e) => set('phone', e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
            Default Service Address
          </h4>
          <Input
            label="Street Address"
            value={form.streetAddress}
            error={errors.streetAddress}
            autoComplete="street-address"
            placeholder="7000 Village Pkwy"
            icon={<Building2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />}
            onChange={(e) => set('streetAddress', e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="City"
              placeholder="Select your city"
              options={SERVICE_AREA_CITIES}
              value={form.city}
              error={errors.city}
              onChange={(e) => set('city', e.target.value)}
            />
            <Input
              label="ZIP Code"
              inputMode="numeric"
              maxLength={5}
              value={form.zipCode}
              error={errors.zipCode}
              autoComplete="postal-code"
              onChange={(e) => {
                const zip = e.target.value.replace(/\D/g, '');
                set('zipCode', zip);
                const area = zip.length === 5 ? checkServiceArea(zip) : null;
                if (area?.city) set('city', area.city);
              }}
              onBlur={() =>
                form.zipCode &&
                !checkServiceArea(form.zipCode).serviceable &&
                setErrors((er) => ({ ...er, zipCode: SERVICE_AREA_ERROR }))
              }
            />
          </div>
          <p className="text-[11px] text-zinc-500">
            Pre-filled when you book a mobile detail. Leave empty if you prefer studio drop-off.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
            Notifications
          </h4>
          <Toggle
            label="SMS reminders"
            hint="Day-before reminder and “on the way” text"
            checked={form.smsReminders}
            onChange={(v) => set('smsReminders', v)}
          />
          <Toggle
            label="Email updates"
            hint="Booking confirmations and service certificates"
            checked={form.emailUpdates}
            onChange={(v) => set('emailUpdates', v)}
          />
        </div>

        {save.error && <p className="text-xs text-rose-400">{save.error.message}</p>}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={close}
            className="px-5 py-2.5 min-h-11 rounded-xl bg-[#3a3a3a] hover:bg-[#4a4a4a] border border-zinc-600 text-white font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={save.isPending}
            className="px-5 py-2.5 min-h-11 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs disabled:opacity-50"
          >
            {save.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
