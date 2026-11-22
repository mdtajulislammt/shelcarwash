import { useState, type FormEvent } from 'react';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { useLookupStore } from '@/features/bookings/store/lookupStore';
import { authService } from '@/services';
import type { BookingLookup } from '@/types';
import type { AuthSession } from '../schemas';
import { CONTACT_ERROR, parseContact } from '../utils/contact';
import { GoogleSignInButton } from './GoogleSignInButton';

const FIELD =
  'flex-1 min-w-0 px-4 py-2.5 min-h-11 rounded-xl bg-[#050505] border border-zinc-700 text-white text-sm focus:outline-none focus:border-yellow-400';
const PRIMARY =
  'px-5 py-2.5 min-h-11 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-all shadow-md flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50';

/**
 * Passwordless sign-in: Google, or a one-time code sent to the email/phone used for booking.
 * On success the session (contact + token) is stored and every page updates.
 */
export function SignInForm() {
  const setSession = useLookupStore((s) => s.setSession);
  const [contact, setContact] = useState<BookingLookup | null>(null);
  const [value, setValue] = useState('');
  const [code, setCode] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [devCode, setDevCode] = useState<string>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const finish = (session: AuthSession) => {
    const lookup: BookingLookup = session.email
      ? { email: session.email }
      : { phone: session.phone ?? contact?.phone };
    setSession(lookup, session.token);
  };

  const run = async (task: () => Promise<void>) => {
    setBusy(true);
    setError(undefined);
    try {
      await task();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const sendCode = (e?: FormEvent) => {
    e?.preventDefault();
    const parsed = contact ?? parseContact(value);
    if (!parsed) return setError(CONTACT_ERROR);
    void run(async () => {
      const res = await authService.requestCode(parsed);
      setContact(parsed);
      setSentTo(res.sentTo);
      setDevCode(res.devCode);
      setCode('');
    });
  };

  const verify = (e: FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    if (!/^\d{6}$/.test(code.trim())) return setError('Enter the 6-digit code');
    void run(async () => finish(await authService.verifyCode(contact, code)));
  };

  if (contact) {
    return (
      <form onSubmit={verify} noValidate className="max-w-md mx-auto space-y-3 text-left">
        <p className="text-xs text-zinc-300">
          We sent a 6-digit code to <strong className="text-white">{sentTo}</strong>.
        </p>
        {devCode && (
          <p className="text-[11px] text-lime-300 bg-lime-950/40 border border-lime-500/30 rounded-lg px-3 py-2">
            Demo mode — nothing is sent. Your code is{' '}
            <span className="font-mono font-black">{devCode}</span>.
          </p>
        )}
        <label
          htmlFor="signin-code"
          className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider"
        >
          Verification code
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="signin-code"
            value={code}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, ''));
              setError(undefined);
            }}
            aria-invalid={!!error}
            placeholder="123456"
            className={`${FIELD} font-mono tracking-[0.3em]`}
          />
          <button type="submit" disabled={busy} className={PRIMARY}>
            <KeyRound className="w-4 h-4" />
            <span>{busy ? 'Verifying…' : 'Verify & Sign In'}</span>
          </button>
        </div>
        {error && <p className="text-xs text-rose-400">{error}</p>}
        <div className="flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={() => {
              setContact(null);
              setError(undefined);
            }}
            className="relative text-zinc-400 hover:text-white flex items-center space-x-1 after:absolute after:-inset-3 after:content-['']"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Use a different email</span>
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => sendCode()}
            className="relative text-lime-400 hover:text-lime-300 font-bold after:absolute after:-inset-3 after:content-['']"
          >
            Resend code
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 text-left">
      <GoogleSignInButton
        onCredential={(jwt) =>
          void run(async () => finish(await authService.signInWithGoogle(jwt)))
        }
      />
      <form onSubmit={sendCode} noValidate className="space-y-2">
        <label
          htmlFor="signin-contact"
          className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider"
        >
          Email or phone number
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="signin-contact"
            value={value}
            autoComplete="email"
            onChange={(e) => {
              setValue(e.target.value);
              setError(undefined);
            }}
            aria-invalid={!!error}
            placeholder="john@gmail.com or (555) 019-2834"
            className={FIELD}
          />
          <button type="submit" disabled={busy} className={PRIMARY}>
            <Mail className="w-4 h-4" />
            <span>{busy ? 'Sending…' : 'Send Sign-In Code'}</span>
          </button>
        </div>
        {error && <p className="text-xs text-rose-400">{error}</p>}
        <p className="text-[11px] text-zinc-500">
          Use the email or phone you booked with. No password needed.
        </p>
      </form>
    </div>
  );
}
