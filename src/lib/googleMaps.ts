import { env } from '@/config/env';

/**
 * Lazy loader for the Google Maps JavaScript API "places" library (Places API New:
 * AutocompleteSuggestion + Place). Only the parts the app uses are typed here.
 */

export interface AddressComponent {
  longText: string | null;
  shortText: string | null;
  types: string[];
}

export interface PlaceResult {
  addressComponents?: AddressComponent[];
  fetchFields(options: { fields: string[] }): Promise<unknown>;
}

export interface PlacePrediction {
  placeId: string;
  text: { text: string };
  mainText?: { text: string } | null;
  secondaryText?: { text: string } | null;
  toPlace(): PlaceResult;
}

export interface AutocompleteRequest {
  input: string;
  includedRegionCodes?: string[];
  includedPrimaryTypes?: string[];
  locationBias?: { center: { lat: number; lng: number }; radius: number };
  sessionToken?: unknown;
}

export interface PlacesLibrary {
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions(
      request: AutocompleteRequest,
    ): Promise<{ suggestions: Array<{ placePrediction: PlacePrediction | null }> }>;
  };
  AutocompleteSessionToken: new () => unknown;
}

interface GoogleMapsGlobal {
  maps: { importLibrary(name: 'places'): Promise<unknown> };
}

const CALLBACK = '__ccGoogleMapsReady';
let placesPromise: Promise<PlacesLibrary> | null = null;

/**
 * Loads the script once (on first use). Rejects without a key, on a network/script error or an
 * auth failure, so callers can fall back to a plain input. A failed load is not retried.
 */
export function loadPlacesLibrary(apiKey: string = env.googleMapsApiKey): Promise<PlacesLibrary> {
  if (!apiKey) return Promise.reject(new Error('Google Maps API key is not configured'));
  if (placesPromise) return placesPromise;

  placesPromise = new Promise<PlacesLibrary>((resolve, reject) => {
    const w = window as unknown as Record<string, unknown> & { google?: GoogleMapsGlobal };
    w[CALLBACK] = () => {
      w.google?.maps.importLibrary('places').then((lib) => resolve(lib as PlacesLibrary), reject);
    };
    // Called by the Maps script when the key is invalid or not allowed for this site.
    w.gm_authFailure = () => reject(new Error('Google Maps authentication failed'));

    const script = document.createElement('script');
    const params = new URLSearchParams({
      key: apiKey,
      v: 'weekly',
      loading: 'async',
      libraries: 'places',
      callback: CALLBACK,
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.onerror = () => reject(new Error('Could not load Google Maps'));
    document.head.appendChild(script);
  });
  placesPromise.catch(() => undefined); // handled by callers; avoid unhandled rejections
  return placesPromise;
}

export interface ParsedAddress {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

/** Place address components → our address fields ("7000 Village Pkwy", "Dublin", "CA", "94568"). */
export function parseAddressComponents(components: AddressComponent[] = []): ParsedAddress {
  const find = (type: string, short = false) => {
    const c = components.find((x) => x.types.includes(type));
    return (short ? c?.shortText : c?.longText) ?? '';
  };
  const street = [find('street_number'), find('route')].filter(Boolean).join(' ');
  const subpremise = find('subpremise');
  return {
    streetAddress: subpremise ? `${street} #${subpremise}` : street,
    city: find('locality') || find('postal_town') || find('sublocality') || find('neighborhood'),
    state: find('administrative_area_level_1', true),
    zipCode: find('postal_code').slice(0, 5),
  };
}
