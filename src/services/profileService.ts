import { profileSchema, type Profile } from '@/features/profile/schemas';
import { useProfileStore } from '@/features/profile/store/profileStore';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { DEFAULT_LATENCY_MS, delay, type MockOptions } from './mock/mockDb';

/** Saved customer profile (pre-fills the next booking). */
export interface ProfileService {
  /** Saved profile, or null. */
  get(): Promise<Profile | null>;
  /** Validates and saves. */
  save(profile: Profile): Promise<Profile>;
  clear(): Promise<void>;
}

/** Device profile in the persisted zustand store (localStorage "cc_profile_v1"). */
export function createLocalProfileService(opts: MockOptions = {}): ProfileService {
  const latency = opts.latencyMs ?? DEFAULT_LATENCY_MS;
  return {
    async get() {
      await delay(latency);
      const parsed = profileSchema.safeParse(useProfileStore.getState().profile);
      return parsed.success ? parsed.data : null;
    },
    async save(profile) {
      await delay(latency);
      const parsed = profileSchema.parse(profile);
      useProfileStore.getState().setProfile(parsed);
      return parsed;
    },
    async clear() {
      await delay(latency);
      useProfileStore.getState().clearProfile();
    },
  };
}

/**
 * Real API: guests keep the device profile; signed-in customers also sync it with
 * GET / PUT / DELETE /api/me/profile.
 */
export function createHttpProfileService(
  isSignedIn: () => boolean,
  local: ProfileService = createLocalProfileService({ latencyMs: 0 }),
): ProfileService {
  return {
    async get() {
      if (!isSignedIn()) return local.get();
      const remote = await apiClient.get(endpoints.profile, { schema: profileSchema.nullable() });
      return remote ?? local.get();
    },
    async save(profile) {
      const saved = await local.save(profile);
      if (!isSignedIn()) return saved;
      return apiClient.put(endpoints.profile, saved, { schema: profileSchema });
    },
    async clear() {
      await local.clear();
      if (isSignedIn()) await apiClient.delete(endpoints.profile);
    },
  };
}
