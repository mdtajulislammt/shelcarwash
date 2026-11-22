import { useEffect, useRef, useState } from 'react';
import { env } from '@/config/env';

interface GoogleIdApi {
  initialize(config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
    ux_mode?: 'popup';
  }): void;
  renderButton(el: HTMLElement, options: Record<string, unknown>): void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdApi } };
  }
}

const GSI_SRC = 'https://accounts.google.com/gsi/client';
let gsiPromise: Promise<void> | null = null;

function loadGsi(): Promise<void> {
  if (window.google?.accounts.id) return Promise.resolve();
  gsiPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GSI_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gsiPromise = null;
      reject(new Error('Could not load Google sign-in'));
    };
    document.head.appendChild(script);
  });
  return gsiPromise;
}

/**
 * Official "Continue with Google" button (Google Identity Services). Renders only when
 * VITE_GOOGLE_CLIENT_ID is set; the ID token goes to the backend for verification.
 */
export function GoogleSignInButton({ onCredential }: { onCredential: (jwt: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  const [error, setError] = useState<string>();

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!env.googleClientId) return;
    let cancelled = false;
    loadGsi()
      .then(() => {
        const el = ref.current;
        const google = window.google;
        if (cancelled || !el || !google) return;
        google.accounts.id.initialize({
          client_id: env.googleClientId,
          callback: (res) => callbackRef.current(res.credential),
          ux_mode: 'popup',
        });
        google.accounts.id.renderButton(el, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: Math.min(el.offsetWidth || 320, 400),
        });
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!env.googleClientId) {
    return import.meta.env.DEV ? (
      <p className="text-[11px] text-zinc-500">
        "Continue with Google" appears once <code>VITE_GOOGLE_CLIENT_ID</code> is set.
      </p>
    ) : null;
  }

  return (
    <div className="space-y-1">
      <div ref={ref} className="w-full flex justify-center min-h-11" />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
