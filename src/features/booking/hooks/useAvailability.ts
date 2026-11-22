import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import { availabilityService } from '@/services';

export function useAvailability(date: string) {
  return useQuery({
    queryKey: queryKeys.availability(date),
    queryFn: () => availabilityService.getAvailability(date),
    enabled: !!date,
    staleTime: 30_000,
  });
}
