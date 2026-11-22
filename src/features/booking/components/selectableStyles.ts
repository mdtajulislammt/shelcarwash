/** Selected / idle card treatments from the original design. */
export const SELECTED_CARD =
  'bg-gradient-to-r from-lime-950/90 via-[#3a3a3a] to-lime-900/80 border-yellow-300';
export const IDLE_CARD = 'bg-[#3a3a3a] hover:bg-[#4a4a4a] border-zinc-700';

/** Keyboard support for clickable cards (Enter / Space). */
export function onActivateKey(action: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };
}
