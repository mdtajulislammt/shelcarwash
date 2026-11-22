/** Storage keys used by the app. Bump the version suffix on breaking shape changes. */
export const STORAGE_KEYS = {
  bookings: 'cc_bookings_v1',
  customerLookup: 'cc_customer_lookup_v1',
} as const;

/** Safe JSON read: returns `fallback` when storage is unavailable or the value is corrupt. */
export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full / disabled (private mode). Non-fatal for the UI.
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
