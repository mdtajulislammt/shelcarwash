/**
 * Selectable card (vehicle, package, add-on, slot, date, frequency…). Styling lives in
 * `.select-card` (styles/index.css) and switches to the yellow gradient via aria-checked /
 * aria-pressed, so the selected state is always the accessible state.
 */
export const SELECT_CARD = 'select-card';

/** Keyboard support for clickable cards (Enter / Space). */
export function onActivateKey(action: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };
}
