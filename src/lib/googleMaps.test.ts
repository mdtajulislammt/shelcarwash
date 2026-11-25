import { describe, expect, it } from 'vitest';
import { loadPlacesLibrary, parseAddressComponents } from './googleMaps';

const c = (types: string[], longText: string, shortText = longText) => ({
  types,
  longText,
  shortText,
});

describe('Google Places address parsing', () => {
  it('maps address components to street / city / state / ZIP', () => {
    expect(
      parseAddressComponents([
        c(['street_number'], '7000'),
        c(['route'], 'Village Parkway', 'Village Pkwy'),
        c(['locality', 'political'], 'Dublin'),
        c(['administrative_area_level_1', 'political'], 'California', 'CA'),
        c(['postal_code'], '94568'),
        c(['postal_code_suffix'], '1234'),
      ]),
    ).toEqual({
      streetAddress: '7000 Village Parkway',
      city: 'Dublin',
      state: 'CA',
      zipCode: '94568',
    });
  });

  it('keeps unit numbers and tolerates missing parts', () => {
    expect(
      parseAddressComponents([
        c(['subpremise'], '12'),
        c(['street_number'], '1'),
        c(['route'], 'Main St'),
      ]),
    ).toEqual({ streetAddress: '1 Main St #12', city: '', state: '', zipCode: '' });
    expect(parseAddressComponents()).toEqual({
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
    });
  });

  it('does not load the script without an API key (plain input fallback)', async () => {
    await expect(loadPlacesLibrary('')).rejects.toThrow(/not configured/);
    expect(document.querySelector('script[src*="maps.googleapis.com"]')).toBeNull();
  });
});
