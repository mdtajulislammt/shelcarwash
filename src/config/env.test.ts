import { describe, expect, it } from 'vitest';
import { parseEnv } from './env';

describe('env', () => {
  it('defaults to the mock API', () => {
    expect(parseEnv({})).toEqual({
      apiUrl: '',
      useMockApi: true,
      stripePublishableKey: '',
      googleClientId: '',
      googleMapsApiKey: '',
    });
  });

  it('requires VITE_API_URL when mocks are off', () => {
    expect(() => parseEnv({ VITE_USE_MOCK_API: 'false' })).toThrow(/VITE_API_URL/);
    expect(
      parseEnv({ VITE_USE_MOCK_API: 'false', VITE_API_URL: 'https://api.example.com/' }),
    ).toMatchObject({ useMockApi: false, apiUrl: 'https://api.example.com' });
  });
});
