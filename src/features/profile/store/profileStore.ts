import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/storage';
import type { Profile } from '../schemas';

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

/**
 * Device copy of the customer profile (localStorage "cc_profile_v1").
 * Components don't use this directly — go through profileService / the profile hooks.
 */
export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: STORAGE_KEYS.profile,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ profile: s.profile }),
    },
  ),
);
