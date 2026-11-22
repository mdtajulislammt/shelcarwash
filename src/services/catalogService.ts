import { CATALOG } from '@/data/services';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { Catalog } from '@/types';
import { DEFAULT_LATENCY_MS, delay, type MockOptions } from './mock/mockDb';

/** GET /api/services — vehicles, packages and add-ons. */
export interface CatalogService {
  getCatalog(): Promise<Catalog>;
}

export function createMockCatalogService(opts: MockOptions = {}): CatalogService {
  const latency = opts.latencyMs ?? DEFAULT_LATENCY_MS;
  return {
    async getCatalog() {
      await delay(latency);
      return CATALOG;
    },
  };
}

export function createHttpCatalogService(): CatalogService {
  return {
    getCatalog: () => apiClient.get<Catalog>(endpoints.services),
  };
}
