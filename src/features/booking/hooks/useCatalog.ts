import { useQuery } from '@tanstack/react-query';
import { CATALOG } from '@/data/services';
import { queryKeys } from '@/lib/api/queryKeys';
import { catalogService } from '@/services';

/**
 * Vehicles, packages and add-ons. Seeded with the bundled catalog so the first
 * render is instant and identical; the API can override it later.
 */
export function useCatalog() {
  const { data } = useQuery({
    queryKey: queryKeys.catalog,
    queryFn: () => catalogService.getCatalog(),
    initialData: CATALOG,
    staleTime: Infinity,
  });
  return data;
}
