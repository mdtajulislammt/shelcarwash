import { Mail, MapPin, Phone, User } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SERVICE_AREA_CITIES } from '@/config/site';
import type { CustomerField } from '../schemas';
import { useBookingStore } from '../store/bookingStore';
import type { FieldErrors } from './VehicleSpecsFields';

const ICON = 'w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none';

interface CustomerFormProps {
  errors: FieldErrors;
  onChange: (field: CustomerField, value: string) => void;
  onZipBlur: () => void;
}

/** Step 4: contact details + service address (mobile only, service-area cities/ZIPs). */
export function CustomerForm({ errors, onChange, onZipBlur }: CustomerFormProps) {
  const c = useBookingStore((s) => s.customer);
  const isMobile = c.serviceType === 'mobile';

  return (
    <div className="space-y-4 border-t border-zinc-800 pt-6">
      <h3 className="text-base font-bold text-white flex items-center space-x-2">
        <User className="w-4 h-4 text-yellow-300" />
        <span>4. Customer Contact</span>
      </h3>

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
          <Input
            label="Street Address (Mobile Location) *"
            name="streetAddress"
            autoComplete="street-address"
            placeholder="123 Main St"
            icon={<MapPin className={ICON} />}
            value={c.streetAddress}
            error={errors.streetAddress}
            onChange={(e) => onChange('streetAddress', e.target.value)}
          />
        )}
      </div>

      {isMobile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            label="ZIP Code *"
            name="zipCode"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            placeholder="e.g. 94568"
            value={c.zipCode}
            error={errors.zipCode}
            onChange={(e) => onChange('zipCode', e.target.value.replace(/\D/g, ''))}
            onBlur={onZipBlur}
          />
        </div>
      )}
    </div>
  );
}
