import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  durationMs?: number;
}

/** Small transient notice above the bottom dock. Renders nothing while `message` is null. */
export function Toast({ message, onDismiss, durationMs = 3000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(id);
  }, [message, onDismiss, durationMs]);

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-2rem)] max-w-sm pointer-events-none"
    >
      {message && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-card bg-card border border-card-border shadow-card text-sm font-semibold text-white">
          <Info className="w-4 h-4 text-brand shrink-0" />
          <span>{message}</span>
        </div>
      )}
    </div>,
    document.body,
  );
}
