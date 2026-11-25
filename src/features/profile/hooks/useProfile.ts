import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLookupStore } from '@/features/bookings/store/lookupStore';
import { queryKeys } from '@/lib/api/queryKeys';
import { profileService } from '@/services';
import type { Profile } from '../schemas';

function useProfileKey() {
  const signedIn = useLookupStore((s) => !!s.token);
  return queryKeys.profile(signedIn);
}

export function useProfile() {
  return useQuery({ queryKey: useProfileKey(), queryFn: () => profileService.get() });
}

export function useSaveProfile() {
  const key = useProfileKey();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: Profile) => profileService.save(profile),
    onSuccess: (saved) => queryClient.setQueryData(key, saved),
  });
}

export function useClearProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => profileService.clear(),
    onSuccess: () => queryClient.setQueriesData({ queryKey: queryKeys.profileAll }, null),
  });
}
