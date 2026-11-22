import { z } from 'zod';
import {
  accountSettingsSchema,
  manualEventInputSchema,
  manualEventSchema,
  type AccountSettings,
  type ManualEvent,
  type ManualEventInput,
} from '@/features/account/schemas';
import { ApiError, apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { readJson, STORAGE_KEYS, writeJson } from '@/lib/storage';
import { DEFAULT_LATENCY_MS, delay, generateId, type MockOptions } from './mock/mockDb';

/**
 * Signed-in customer's settings and personal calendar events.
 * HTTP: the customer is identified by the Bearer token; `contact` is only used by the mock.
 */
export interface AccountService {
  /** GET /api/me/settings (null until saved once) */
  getSettings(contact: string): Promise<AccountSettings | null>;
  /** PUT /api/me/settings */
  updateSettings(contact: string, settings: AccountSettings): Promise<AccountSettings>;
  /** GET /api/me/events */
  listEvents(contact: string): Promise<ManualEvent[]>;
  /** POST /api/me/events */
  addEvent(contact: string, input: ManualEventInput): Promise<ManualEvent>;
  /** DELETE /api/me/events/:id */
  deleteEvent(contact: string, id: string): Promise<void>;
}

interface StoredAccount {
  settings: AccountSettings | null;
  events: ManualEvent[];
}

function readAll(): Record<string, StoredAccount> {
  const data = readJson<unknown>(STORAGE_KEYS.account, {});
  return data && typeof data === 'object' ? (data as Record<string, StoredAccount>) : {};
}

function readAccount(contact: string): StoredAccount {
  return readAll()[contact] ?? { settings: null, events: [] };
}

function writeAccount(contact: string, account: StoredAccount): void {
  writeJson(STORAGE_KEYS.account, { ...readAll(), [contact]: account });
}

function requireContact(contact: string): void {
  if (!contact) throw new ApiError('Please sign in first.', 401, 'UNAUTHORIZED');
}

export function createMockAccountService(opts: MockOptions = {}): AccountService {
  const latency = opts.latencyMs ?? DEFAULT_LATENCY_MS;
  const now = opts.now ?? (() => new Date());
  return {
    async getSettings(contact) {
      await delay(latency);
      return readAccount(contact).settings;
    },
    async updateSettings(contact, settings) {
      await delay(latency);
      requireContact(contact);
      const parsed = accountSettingsSchema.parse(settings);
      writeAccount(contact, { ...readAccount(contact), settings: parsed });
      return parsed;
    },
    async listEvents(contact) {
      await delay(latency);
      return readAccount(contact).events;
    },
    async addEvent(contact, input) {
      await delay(latency);
      requireContact(contact);
      const parsed = manualEventInputSchema.parse(input);
      const event: ManualEvent = {
        ...parsed,
        id: generateId('EV'),
        createdAt: now().toISOString(),
      };
      const account = readAccount(contact);
      writeAccount(contact, { ...account, events: [...account.events, event] });
      return event;
    },
    async deleteEvent(contact, id) {
      await delay(latency);
      requireContact(contact);
      const account = readAccount(contact);
      writeAccount(contact, { ...account, events: account.events.filter((e) => e.id !== id) });
    },
  };
}

export function createHttpAccountService(): AccountService {
  return {
    getSettings: () =>
      apiClient.get(endpoints.accountSettings, { schema: accountSettingsSchema.nullable() }),
    updateSettings: (_contact, settings) =>
      apiClient.put(endpoints.accountSettings, settings, { schema: accountSettingsSchema }),
    listEvents: () =>
      apiClient.get(endpoints.accountEvents, { schema: z.array(manualEventSchema) }),
    addEvent: (_contact, input) =>
      apiClient.post(endpoints.accountEvents, input, { schema: manualEventSchema }),
    deleteEvent: async (_contact, id) => {
      await apiClient.delete(endpoints.accountEvent(id));
    },
  };
}
