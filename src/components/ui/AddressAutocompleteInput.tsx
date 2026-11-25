import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { MapPin } from 'lucide-react';
import { env } from '@/config/env';
import {
  loadPlacesLibrary,
  parseAddressComponents,
  type ParsedAddress,
  type PlacePrediction,
  type PlacesLibrary,
} from '@/lib/googleMaps';
import { Input } from './Input';

interface AddressAutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Called with street / city / state / ZIP when a suggestion is chosen. */
  onSelectAddress: (address: ParsedAddress) => void;
  error?: string;
  name?: string;
  placeholder?: string;
  icon?: ReactNode;
}

/** Tri-Valley center; suggestions are biased toward the service area (not restricted). */
const LOCATION_BIAS = { center: { lat: 37.77, lng: -121.95 }, radius: 30000 };
const MIN_CHARS = 3;
const DEBOUNCE_MS = 250;

/**
 * Street-address input with Google Places Autocomplete (US only). Without
 * VITE_GOOGLE_MAPS_API_KEY, or if the script fails, it stays a normal text input.
 */
export function AddressAutocompleteInput({
  label,
  value,
  onChange,
  onSelectAddress,
  error,
  name,
  placeholder,
  icon,
}: AddressAutocompleteInputProps) {
  const listId = useId();
  const [places, setPlaces] = useState<PlacesLibrary | null>(null);
  const [failed, setFailed] = useState(!env.googleMapsApiKey);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const sessionToken = useRef<unknown>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const ensureLoaded = () => {
    if (places || failed) return;
    loadPlacesLibrary().then(setPlaces, () => setFailed(true));
  };

  const fetchSuggestions = (input: string) => {
    window.clearTimeout(timer.current);
    if (!places || failed || input.trim().length < MIN_CHARS) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    timer.current = window.setTimeout(async () => {
      try {
        sessionToken.current ??= new places.AutocompleteSessionToken();
        const { suggestions: results } =
          await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input,
            includedRegionCodes: ['us'],
            includedPrimaryTypes: ['street_address', 'premise', 'subpremise'],
            locationBias: LOCATION_BIAS,
            sessionToken: sessionToken.current,
          });
        const predictions = results
          .map((r) => r.placePrediction)
          .filter((p): p is PlacePrediction => !!p);
        setSuggestions(predictions);
        setActive(-1);
        setOpen(predictions.length > 0);
      } catch {
        // Quota / auth / network problem — keep working as a plain input.
        setFailed(true);
        setSuggestions([]);
        setOpen(false);
      }
    }, DEBOUNCE_MS);
  };

  const choose = async (prediction: PlacePrediction) => {
    setOpen(false);
    setSuggestions([]);
    try {
      const place = prediction.toPlace();
      await place.fetchFields({ fields: ['addressComponents'] });
      const address = parseAddressComponents(place.addressComponents);
      onSelectAddress({
        ...address,
        streetAddress: address.streetAddress || prediction.mainText?.text || value,
      });
    } catch {
      onChange(prediction.mainText?.text ?? prediction.text.text);
    } finally {
      sessionToken.current = null; // a selection ends the billing session
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      void choose(suggestions[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const autocompleteOn = !failed && !!places;
  const optionId = (i: number) => `${listId}-opt-${i}`;

  return (
    <Input
      label={label}
      name={name}
      autoComplete={autocompleteOn ? 'off' : 'street-address'}
      placeholder={placeholder}
      icon={icon}
      value={value}
      error={error}
      role={autocompleteOn ? 'combobox' : undefined}
      aria-autocomplete={autocompleteOn ? 'list' : undefined}
      aria-expanded={autocompleteOn ? open : undefined}
      aria-controls={autocompleteOn ? listId : undefined}
      aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
      onFocus={ensureLoaded}
      onBlur={() => setOpen(false)}
      onKeyDown={onKeyDown}
      onChange={(e) => {
        onChange(e.target.value);
        fetchSuggestions(e.target.value);
      }}
    >
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-card bg-surface-4 border border-card-border shadow-card overflow-hidden">
          <ul id={listId} role="listbox" aria-label="Address suggestions">
            {suggestions.map((s, i) => (
              <li
                key={s.placeId}
                id={optionId(i)}
                role="option"
                aria-selected={i === active}
                // mousedown keeps focus in the input so blur doesn't close the list first
                onMouseDown={(e) => {
                  e.preventDefault();
                  void choose(s);
                }}
                className={`flex items-start gap-2 px-3 py-2.5 min-h-11 cursor-pointer text-sm ${
                  i === active ? 'bg-card-hover' : 'hover:bg-card'
                }`}
              >
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand" />
                <span className="min-w-0">
                  <span className="block text-white font-semibold truncate">
                    {s.mainText?.text ?? s.text.text}
                  </span>
                  {s.secondaryText?.text && (
                    <span className="block text-xs text-muted truncate">
                      {s.secondaryText.text}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <p className="px-3 py-1.5 text-[10px] text-muted text-right border-t border-card-border">
            Powered by Google
          </p>
        </div>
      )}
    </Input>
  );
}
