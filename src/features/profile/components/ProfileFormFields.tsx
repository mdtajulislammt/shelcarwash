import { Mail, MapPin, Phone, User } from 'lucide-react';
import { AddressAutocompleteInput } from '@/components/ui/AddressAutocompleteInput';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SERVICE_AREA_CITIES } from '@/config/site';
import type { ProfileFormState } from '../hooks/useProfileForm';

const ICON = 'w-4 h-4 text-zinc-500 absolute left-3 top-3.5 pointer-events-none';

/** Name, email, phone and default service address (Google Places autocomplete). */
export function ProfileFormFields({ state }: { state: ProfileFormState }) {
  const { form, errors, set, applyAddress, checkZip } = state;
  return (
    <div className="space-y-3">
      <Input
        label="Full Name *"
        name="fullName"
        autoComplete="name"
        icon={<User className={ICON} />}
        value={form.fullName}
        error={errors.fullName}
        onChange={(e) => set('fullName', e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Phone Number *"
          name="phone"
          type="tel"
          autoComplete="tel"
          icon={<Phone className={ICON} />}
          value={form.phone}
          error={errors.phone}
          onChange={(e) => set('phone', e.target.value)}
        />
        <Input
          label="Email (optional)"
          name="email"
          type="email"
          autoComplete="email"
          icon={<Mail className={ICON} />}
          value={form.email}
          error={errors.email}
          onChange={(e) => set('email', e.target.value)}
        />
      </div>
      <AddressAutocompleteInput
        label="Service Address"
        name="streetAddress"
        placeholder="Start typing your address"
        icon={<MapPin className={ICON} />}
        value={form.streetAddress}
        error={errors.streetAddress}
        onChange={(v) => set('streetAddress', v)}
        onSelectAddress={applyAddress}
      />
      <div className="grid grid-cols-[1fr_4.5rem_6.5rem] gap-3">
        <Select
          label="City"
          name="city"
          placeholder="Select city"
          options={SERVICE_AREA_CITIES}
          value={form.city}
          error={errors.city}
          onChange={(e) => set('city', e.target.value)}
        />
        <Input
          label="State"
          name="state"
          autoComplete="address-level1"
          maxLength={2}
          value={form.state}
          error={errors.state}
          onChange={(e) => set('state', e.target.value.toUpperCase())}
        />
        <Input
          label="ZIP Code"
          name="zipCode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          value={form.zipCode}
          error={errors.zipCode}
          onChange={(e) => set('zipCode', e.target.value.replace(/\D/g, ''))}
          onBlur={() => void checkZip(form.zipCode)}
        />
      </div>
    </div>
  );
}
