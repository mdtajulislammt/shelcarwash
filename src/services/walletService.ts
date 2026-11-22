import { walletSaveLinkSchema, type WalletSaveLink } from '@/features/account/schemas';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { DEFAULT_LATENCY_MS, delay, type MockOptions } from './mock/mockDb';

/**
 * "Add to Google Wallet". The backend (Google Wallet API issuer account) creates the pass
 * objects and returns a signed save link; the browser just opens it.
 */
export interface WalletService {
  /** POST /api/wallet/save-link { passIds } */
  createSaveLink(passIds: string[]): Promise<WalletSaveLink>;
}

/** No issuer credentials in the browser, so the mock can't create real passes. */
export function createMockWalletService(opts: MockOptions = {}): WalletService {
  const latency = opts.latencyMs ?? DEFAULT_LATENCY_MS;
  return {
    async createSaveLink() {
      await delay(latency);
      return { saveUrl: null };
    },
  };
}

export function createHttpWalletService(): WalletService {
  return {
    createSaveLink: (passIds) =>
      apiClient.post(endpoints.walletSaveLink, { passIds }, { schema: walletSaveLinkSchema }),
  };
}
