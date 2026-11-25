import { CheckCircle2, Mail, MapPin, Pencil, Phone, User } from 'lucide-react';
import { AddressAutocompleteInput } from '@/components/ui/AddressAutocompleteInput';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SERVICE_AREA_CITIES } from '@/config/site';
import type { ParsedAddress } from '@/lib/googleMaps';
import type { CustomerField } from '../schemas';
import { useBookingStore } from '../store/bookingStore';
import type { FieldErrors } from './VehicleSpecsFields';

const ICON = 'w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none';

interface CustomerFormProps {
  errors: FieldErrors;
  onChange: (field: CustomerField, value: string) => void;
  onZipBlur: () => void;
  onSelectAddress: (address: ParsedAddress) => void;
  /** Show the saved-profile summary instead of the fields. */
  usingSavedProfile: boolean;
  onEditSavedProfile: () => void;
}

function SavedContactSummary({ onEdit }: { onEdit: () => void }) {
  const c = useBookingStore((s) => s.customer);
  const isMobile = c.serviceType === 'mobile';
  return (
    <div className="p-4 rounded-card bg-surface-4 border border-card-border flex flex-col sm:flex-row sm:items-start justify-between gap-3">
      <div className="min-w-0 space-y-1.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Using your saved profile
        </p>
        <p className="text-sm font-bold text-white">{c.fullName}</p>
        <ul className="text-xs text-muted space-y-0.5">
          <li className="flex items-center gap-1.5 min-w-0">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{c.email}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            {c.phone}
          </li>
          {isMobile && (
            <li className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {c.streetAddress}, {c.city}, {c.state} {c.zipCode}
              </span>
            </li>
          )}
        </ul>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="self-start shrink-0 px-4 py-2 min-h-11 rounded-xl bg-brand hover:bg-brand-2 text-ink text-xs font-extrabold flex items-center gap-1.5"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit
      </button>
    </div>
  );
}

/** Step 4: contact details + service address (mobile only, service-area cities/ZIPs). */
export function CustomerForm({
  errors,
  onChange,
  onZipBlur,
  onSelectAddress,
  usingSavedProfile,
  onEditSavedProfile,
}: CustomerFormProps) {
  const c = useBookingStore((s) => s.customer);
  const isMobile = c.serviceType === 'mobile';

  return (
    <div className="space-y-4 border-t border-zinc-800 pt-6">
      <h3 className="text-base font-bold text-white flex items-center space-x-2">
        <User className="w-4 h-4 text-brand" />
        <span>4. Customer Contact</span>
      </h3>

      {usingSavedProfile ? (
        <SavedContactSummary onEdit={onEditSavedProfile} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              name="fullName"
              autoComplete="name"
              placeholder="John Doe"
              icon={<User className={ICON} />}
              value={c.fullName}
              error={errors.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
            />
            <Input
              label="Email Address (Booking Confirmation) *"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="john@gmail.com"
              icon={<Mail className={ICON} />}
              value={c.email}
              error={errors.email}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number *"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(555) 019-2834"
              icon={<Phone className={ICON} />}
              value={c.phone}
              error={errors.phone}
              onChange={(e) => onChange('phone', e.target.value)}
            />
            {isMobile && (
              <AddressAutocompleteInput
                label="Street Address (Mobile Location) *"
                name="streetAddress"
                placeholder="Start typing your address"
                icon={<MapPin className={ICON} />}
                value={c.streetAddress}
                error={errors.streetAddress}
                onChange={(v) => onChange('streetAddress', v)}
                onSelectAddress={onSelectAddress}
              />
            )}
          </div>

          {isMobile && (
            <div className="grid grid-cols-[1fr_4.5rem] sm:grid-cols-[1fr_5rem_1fr] gap-4">
              <Select
                label="City *"
                name="city"
                autoComplete="address-level2"
                placeholder="Select your city"
                options={SERVICE_AREA_CITIES}
                value={c.city}
                error={errors.city}
                onChange={(e) => onChange('city', e.target.value)}
              />
              <Input
                label="State *"
                name="state"
                autoComplete="address-level1"
                maxLength={2}
                value={c.state}
                error={errors.state}
                onChange={(e) => onChange('state', e.target.value.toUpperCase())}
              />
              <Input
                label="ZIP Code *"
                name="zipCode"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                placeholder="e.g. 94568"
                className="col-span-2 sm:col-span-1"
                value={c.zipCode}
                error={errors.zipCode}
                onChange={(e) => onChange('zipCode', e.target.value.replace(/\D/g, ''))}
                onBlur={onZipBlur}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
