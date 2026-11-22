import { z } from 'zod';
import { TIME_SLOTS } from '@/config/site';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { isBookableDate } from '@/lib/dates';
import type { SlotAvailability } from '@/types';
import {
  DEFAULT_LATENCY_MS,
  delay,
  isSlotTaken,
  readBookings,
  type MockOptions,
} from './mock/mockDb';

/** GET /api/availability?date=YYYY-MM-DD */
export interface AvailabilityService {
  getAvailability(date: string): Promise<SlotAvailability[]>;
}

const availabilityResponseSchema = z.object({
  date: z.string(),
  slots: z.array(
    z.object({
      id: z.string(),
      start: z.string(),
      end: z.string(),
      label: z.string(),
      period: z.string(),
      available: z.boolean(),
    }),
  ),
});

export function createMockAvailabilityService(opts: MockOptions = {}): AvailabilityService {
  const latency = opts.latencyMs ?? DEFAULT_LATENCY_MS / 2;
  const now = opts.now ?? (() => new Date());
  return {
    async getAvailability(date) {
      await delay(latency);
      const bookable = isBookableDate(date, now());
      const bookings = readBookings();
      return TIME_SLOTS.map((slot) => ({
        ...slot,
        available: bookable && !isSlotTaken(bookings, date, slot.id),
      }));
    },
  };
}

export function createHttpAvailabilityService(): AvailabilityService {
  return {
    async getAvailability(date) {
      const res = await apiClient.get(endpoints.availability, {
        query: { date },
        schema: availabilityResponseSchema,
      });
      return res.slots;
    },
  };
}
