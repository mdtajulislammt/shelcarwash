import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { digitsOnly } from '@/lib/format';
import type { BookingLookup } from '@/types';

/** Find bookings by the email or phone number used at checkout. */
export function BookingLookupForm({ onSubmit }: { onSubmit: (lookup: BookingLookup) => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (v.includes('@') && /^\S+@\S+\.\S+$/.test(v)) return onSubmit({ email: v.toLowerCase() });
    if (digitsOnly(v).length >= 10) return onSubmit({ phone: digitsOnly(v) });
    setError('Enter the email or 10-digit phone number you booked with');
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md mx-auto space-y-2 text-left">
      <label
        htmlFor="booking-lookup"
        className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider"
      >
        Email or phone number
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id="booking-lookup"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(undefined);
          }}
          aria-invalid={!!error}
          placeholder="john@gmail.com or (555) 019-2834"
          className="flex-1 min-w-0 px-4 py-2.5 min-h-11 rounded-xl bg-[#050505] border border-zinc-700 text-white text-sm focus:outline-none focus:border-yellow-400"
        />
        <button
          type="submit"
          className="px-5 py-2.5 min-h-11 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition-all shadow-md flex items-center justify-center space-x-2 shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Find My Bookings</span>
        </button>
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </form>
  );
}
