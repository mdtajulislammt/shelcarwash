import { useState } from 'react';
import { SERVICE_AREA_CITIES, SERVICE_AREA_ERROR, SERVICE_AREA_ZIPS } from '@/config/site';
import { useServiceAreaCheck } from '@/features/booking/hooks/useServiceAreaCheck';
import { toFieldErrors } from '@/features/booking/schemas';
import { isServiceableZip } from '@/features/booking/utils/serviceArea';
import type { ParsedAddress } from '@/lib/googleMaps';
import { profileSchema, type Profile, type ProfileField } from '../schemas';

export type ProfileErrors = Partial<Record<ProfileField, string>>;

const isAreaCity = (city: string) => (SERVICE_AREA_CITIES as readonly string[]).includes(city);

/** Form state + validation for the profile (My Bookings profile, account settings). */
export function useProfileForm(initial: Profile) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const serviceArea = useServiceAreaCheck();

  const set = (field: ProfileField, value: string) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === 'zipCode' && isServiceableZip(value)) next.city = SERVICE_AREA_ZIPS[value];
      return next;
    });
    setErrors((e) => ({
      ...e,
      [field]: undefined,
      ...(field === 'zipCode' ? { city: undefined } : {}),
    }));
  };

  /** Service-area check through the service layer (POST /api/service-area/check). */
  const checkZip = async (zip: string) => {
    if (!zip) return;
    try {
      const area = await serviceArea.mutateAsync(zip);
      setErrors((e) => ({ ...e, zipCode: area.serviceable ? undefined : SERVICE_AREA_ERROR }));
      if (area.city) setForm((f) => ({ ...f, city: area.city ?? f.city }));
    } catch {
      // Network problem — the schema re-checks the ZIP on save.
    }
  };

  const applyAddress = (address: ParsedAddress) => {
    setForm((f) => ({
      ...f,
      streetAddress: address.streetAddress,
      city: isAreaCity(address.city) ? address.city : '',
      state: address.state || 'CA',
      zipCode: address.zipCode,
    }));
    setErrors((e) => ({
      ...e,
      streetAddress: undefined,
      city: undefined,
      zipCode: undefined,
      state:
        address.state && address.state !== 'CA' ? 'We only service California (CA)' : undefined,
    }));
    void checkZip(address.zipCode);
  };

  /** Returns the parsed profile, or null after showing the errors. */
  const validate = (): Profile | null => {
    const parsed = profileSchema.safeParse(form);
    if (parsed.success) return parsed.data;
    setErrors(toFieldErrors<ProfileField>(parsed.error));
    return null;
  };

  const reset = (profile: Profile) => {
    setForm(profile);
    setErrors({});
  };

  return { form, errors, set, applyAddress, checkZip, validate, reset };
}

export type ProfileFormState = ReturnType<typeof useProfileForm>;
