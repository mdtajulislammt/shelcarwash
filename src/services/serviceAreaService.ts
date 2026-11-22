import { z } from 'zod';
import { checkServiceArea } from '@/features/booking/utils/serviceArea';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { ServiceAreaResult } from '@/types';
import { DEFAULT_LATENCY_MS, delay, type MockOptions } from './mock/mockDb';

/** POST /api/service-area/check { zip } */
export interface ServiceAreaService {
  checkZip(zip: string): Promise<ServiceAreaResult>;
}

const serviceAreaResultSchema = z.object({
  zip: z.string(),
  serviceable: z.boolean(),
  city: z.string().nullable(),
});

export function createMockServiceAreaService(opts: MockOptions = {}): ServiceAreaService {
  const latency = opts.latencyMs ?? DEFAULT_LATENCY_MS / 4;
  return {
    async checkZip(zip) {
      await delay(latency);
      return checkServiceArea(zip);
    },
  };
}

export function createHttpServiceAreaService(): ServiceAreaService {
  return {
    checkZip: (zip) =>
      apiClient.post(endpoints.serviceAreaCheck, { zip }, { schema: serviceAreaResultSchema }),
  };
}
