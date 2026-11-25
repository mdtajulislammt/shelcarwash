import { beforeEach, describe, expect, it } from 'vitest';
import { EMPTY_CUSTOMER } from '@/features/booking/store/bookingStore';
import { STORAGE_KEYS } from '@/lib/storage';
import { createLocalProfileService } from '@/services/profileService';
import { profileSchema, type Profile } from './schemas';
import { useProfileStore } from './store/profileStore';
import { customerPatchFromProfile, matchesProfile, profileFromCustomer } from './utils';

const jane: Profile = {
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  phone: '(925) 555-0100',
  streetAddress: '7000 Village Pkwy',
  city: 'Dublin',
  state: 'CA',
  zipCode: '94568',
};

describe('profile store + service', () => {
  beforeEach(() => useProfileStore.setState({ profile: null }));
  const service = createLocalProfileService({ latencyMs: 0 });

  it('persists the profile under cc_profile_v1 and clears it', async () => {
    expect(await service.get()).toBeNull();
    await service.save(jane);
    expect(await service.get()).toEqual(jane);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.profile)!).state.profile).toEqual(jane);
    await service.clear();
    expect(await service.get()).toBeNull();
    expect(useProfileStore.getState().profile).toBeNull();
  });

  it('rejects an out-of-area address and ignores a corrupt stored profile', async () => {
    await expect(service.save({ ...jane, zipCode: '90001' })).rejects.toThrow();
    useProfileStore.setState({ profile: { ...jane, phone: '12' } });
    expect(await service.get()).toBeNull();
  });
});

describe('profile schema', () => {
  it('makes email and address optional but validates them when given', () => {
    const minimal = { ...jane, email: '', streetAddress: '', city: '', zipCode: '' };
    expect(profileSchema.safeParse(minimal).success).toBe(true);
    expect(profileSchema.safeParse({ ...jane, email: 'nope' }).success).toBe(false);
    expect(profileSchema.safeParse({ ...minimal, city: 'Dublin' }).success).toBe(false);
    expect(profileSchema.safeParse({ ...jane, state: 'NV' }).success).toBe(false);
  });
});

describe('profile ↔ booking form', () => {
  const customer = { ...EMPTY_CUSTOMER, ...customerPatchFromProfile(jane) };

  it('pre-fills the booking form and recognises the saved details', () => {
    expect(customer).toMatchObject({ fullName: 'Jane Doe', zipCode: '94568', state: 'CA' });
    expect(matchesProfile(customer, jane)).toBe(true);
    expect(matchesProfile({ ...customer, phone: '9255550199' }, jane)).toBe(false);
  });

  it('keeps the saved address after a studio drop-off booking', () => {
    const studio = { ...customer, serviceType: 'studio' as const, streetAddress: '' };
    expect(profileFromCustomer(studio, jane).streetAddress).toBe('7000 Village Pkwy');
    expect(profileFromCustomer({ ...customer, fullName: 'Jane D.' }, jane).fullName).toBe(
      'Jane D.',
    );
  });
});
