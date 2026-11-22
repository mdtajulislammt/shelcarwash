import { readJson, STORAGE_KEYS, writeJson } from '@/lib/storage';
import type { Booking } from '@/types';

/**
 * In-browser "database" for mock mode. Bookings live in localStorage under
 * `cc_bookings_v1`, so they survive reloads on this device only.
 */

export interface MockOptions {
  /** Artificial latency in ms (default 400). Tests pass 0. */
  latencyMs?: number;
  /** Clock override for tests. */
  now?: () => Date;
}

export const DEFAULT_LATENCY_MS = 400;

export function delay(ms: number): Promise<void> {
  return ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();
}

export function readBookings(): Booking[] {
  const data = readJson<unknown>(STORAGE_KEYS.bookings, []);
  return Array.isArray(data) ? (data as Booking[]) : [];
}

export function writeBookings(bookings: Booking[]): void {
  writeJson(STORAGE_KEYS.bookings, bookings);
}

export function updateBooking(id: string, patch: Partial<Booking>): Booking | null {
  const bookings = readBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  const updated = { ...bookings[idx], ...patch };
  bookings[idx] = updated;
  writeBookings(bookings);
  return updated;
}

/** One crew → one booking per slot. */
export function isSlotTaken(bookings: Booking[], date: string, slotId: string): boolean {
  return bookings.some((b) => b.date === date && b.slotId === slotId && b.status !== 'cancelled');
}

export function generateId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${rand}`;
}
