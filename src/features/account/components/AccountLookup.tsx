import { Calendar, LogOut, UserRound } from 'lucide-react';
import { SignInForm } from '@/features/auth/components/SignInForm';

interface AccountLookupProps {
  title?: string;
  description?: string;
  notFoundFor: string | null;
  onSignOut: () => void;
  onBook: () => void;
}

/** Sign-in card shown until we know who the customer is. */
export function AccountLookup({
  title = 'My Account',
  description = 'Sign in to see your profile, calendar and service address.',
  notFoundFor,
  onSignOut,
  onBook,
}: AccountLookupProps) {
  return (
    <div className="max-w-md mx-auto bg-surface-4 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
      <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center mx-auto text-brand">
        <UserRound className="w-7 h-7" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{title}</h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mx-auto">
          {notFoundFor ? `No bookings found for ${notFoundFor}.` : description}
        </p>
      </div>
      {notFoundFor ? (
        <button
          type="button"
          onClick={onSignOut}
          className="mx-auto px-4 py-2 min-h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-brand border border-zinc-700 font-extrabold text-xs flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign in with a different account</span>
        </button>
      ) : (
        <SignInForm />
      )}
      <div className="pt-4 border-t border-zinc-800/80 space-y-3">
        <p className="text-xs text-zinc-400">
          New customer? Your account is created when you book.
        </p>
        <button
          type="button"
          onClick={onBook}
          className="w-full py-3.5 min-h-11 rounded-xl bg-brand hover:bg-brand-2 text-ink font-extrabold text-xs transition-all shadow-lg shadow-brand/20 flex items-center justify-center space-x-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Book an Appointment</span>
        </button>
      </div>
    </div>
  );
}
