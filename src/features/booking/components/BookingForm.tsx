import { useState, type FormEvent } from 'react';
import { Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';
import { SERVICE_AREA_CITIES, SERVICE_AREA_ERROR, SERVICE_AREA_ZIPS } from '@/config/site';
import { usePrefillFromProfile } from '@/features/profile/hooks/usePrefillFromProfile';
import { matchesProfile } from '@/features/profile/utils';
import type { ParsedAddress } from '@/lib/googleMaps';
import { useBookingSelection } from '../hooks/useBookingSelection';
import { useServiceAreaCheck } from '../hooks/useServiceAreaCheck';
import { customerSchema, toFieldErrors, type CustomerField } from '../schemas';
import { useBookingStore } from '../store/bookingStore';
import { isServiceableZip } from '../utils/serviceArea';
import { CustomerForm } from './CustomerForm';
import { ProceedBanner } from './ProceedBanner';
import { Scheduler } from './Scheduler';
import { ServiceLocation } from './ServiceLocation';
import { VehicleSpecsFields, type FieldErrors } from './VehicleSpecsFields';

interface BookingFormProps {
  onBack: () => void;
  onValid: () => void;
}

const CONTACT_FIELDS: CustomerField[] = [
  'fullName',
  'email',
  'phone',
  'streetAddress',
  'city',
  'state',
  'zipCode',
];

function focusFirstError() {
  requestAnimationFrame(() => {
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  });
}

/** "/book": schedule + location + vehicle + contact, validated with the shared zod schema. */
export function BookingForm({ onBack, onValid }: BookingFormProps) {
  const { totalPrice, totalDuration, isRecurring, recurringFrequency } = useBookingSelection();
  const customer = useBookingStore((s) => s.customer);
  const date = useBookingStore((s) => s.date);
  const slotId = useBookingStore((s) => s.slotId);
  const updateCustomer = useBookingStore((s) => s.updateCustomer);
  const serviceArea = useServiceAreaCheck();
  const addressAreaCheck = useServiceAreaCheck();
  const profile = usePrefillFromProfile();
  const [editingContact, setEditingContact] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [slotError, setSlotError] = useState<string>();
  const usingSavedProfile =
    !!profile &&
    !editingContact &&
    !CONTACT_FIELDS.some((f) => errors[f]) &&
    matchesProfile(customer, profile);

  const handleChange = (field: CustomerField, value: string) => {
    updateCustomer(field, value);
    if (field === 'zipCode' && isServiceableZip(value)) {
      updateCustomer('city', SERVICE_AREA_ZIPS[value]);
      setErrors((prev) => ({ ...prev, city: undefined }));
    }
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleZipBlur = () => {
    const zip = customer.zipCode.trim();
    if (!zip) return;
    setErrors((prev) => ({
      ...prev,
      zipCode: isServiceableZip(zip) ? undefined : SERVICE_AREA_ERROR,
    }));
  };

  /** Google Places suggestion chosen: fill the address, then check the ZIP via the service. */
  const handleSelectAddress = async (address: ParsedAddress) => {
    const city = (SERVICE_AREA_CITIES as readonly string[]).includes(address.city)
      ? address.city
      : '';
    updateCustomer('streetAddress', address.streetAddress);
    updateCustomer('city', city);
    updateCustomer('state', address.state || 'CA');
    updateCustomer('zipCode', address.zipCode);
    setErrors((prev) => ({
      ...prev,
      streetAddress: undefined,
      city: undefined,
      zipCode: undefined,
      state:
        address.state && address.state !== 'CA' ? 'We only service California (CA)' : undefined,
    }));
    if (!address.zipCode) return;
    try {
      const area = await addressAreaCheck.mutateAsync(address.zipCode);
      if (area.city) updateCustomer('city', area.city);
      if (!area.serviceable) setErrors((prev) => ({ ...prev, zipCode: SERVICE_AREA_ERROR }));
    } catch {
      // Checked again on submit.
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = customerSchema.safeParse(customer);
    const nextErrors = result.success ? {} : toFieldErrors(result.error);
    setErrors(nextErrors);
    setSlotError(slotId ? undefined : 'Please choose an available time slot');
    if (!result.success || !slotId) {
      focusFirstError();
      return;
    }
    if (customer.serviceType === 'mobile') {
      try {
        const area = await serviceArea.mutateAsync(customer.zipCode);
        if (!area.serviceable) {
          setErrors({ zipCode: SERVICE_AREA_ERROR });
          focusFirstError();
          return;
        }
      } catch {
        setErrors({ zipCode: 'Could not verify your ZIP code. Please try again.' });
        return;
      }
    }
    onValid();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <button
        type="button"
        onClick={onBack}
        className="relative after:absolute after:content-[''] after:-inset-y-3 inline-flex items-center space-x-2 text-sm text-brand hover:text-brand font-bold transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-brand" />
        <span>Back to Services & Pricing</span>
      </button>

      <div className="bg-surface-2 rounded-3xl border border-zinc-800 p-6 sm:p-8 space-y-8 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-brand text-ink">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              Appointment Scheduling
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Schedule Appointment & Customer Details
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            You'll receive a booking confirmation as soon as your appointment is booked.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <Scheduler totalDuration={totalDuration} slotError={slotId ? undefined : slotError} />
          <ServiceLocation />
          <VehicleSpecsFields errors={errors} onChange={handleChange} />
          <CustomerForm
            errors={errors}
            onChange={handleChange}
            onZipBlur={handleZipBlur}
            onSelectAddress={handleSelectAddress}
            usingSavedProfile={usingSavedProfile}
            onEditSavedProfile={() => setEditingContact(true)}
          />
          <ProceedBanner
            totalPrice={totalPrice}
            date={date}
            slotId={slotId}
            isRecurring={isRecurring}
            recurringFrequency={recurringFrequency}
            isChecking={serviceArea.isPending}
          />
        </form>
      </div>
    </div>
  );
}
