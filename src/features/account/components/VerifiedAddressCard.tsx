import { Car, CheckCircle2, MapPin, Pencil, Phone, Store } from 'lucide-react';
import { SERVICE_AREA_CITIES, SITE } from '@/config/site';

export function VerifiedAddressCard({
  address,
  onEdit,
}: {
  address: string | null;
  onEdit: () => void;
}) {
  return (
    <div className="bg-surface-4 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-brand shrink-0" />
          <h3 className="text-sm font-extrabold text-white">Verified Address</h3>
        </div>
        {address && (
          <span className="px-2.5 py-0.5 rounded-full bg-lime-400/15 border border-lime-400/40 text-[10px] font-extrabold text-lime-400 flex items-center space-x-1 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
            <span>In Service Area</span>
          </span>
        )}
      </div>

      {address ? (
        <div className="p-4 rounded-xl bg-surface border-2 border-brand shadow-sm shadow-brand/20 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold uppercase text-brand tracking-wider">
              Primary Service Address
            </span>
            <button
              type="button"
              onClick={onEdit}
              className="relative text-[11px] font-bold text-brand hover:text-brand-2 flex items-center space-x-1 after:absolute after:-inset-3 after:content-['']"
            >
              <Pencil className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="text-sm font-extrabold leading-snug font-mono bg-lime-950/30 p-3 rounded-lg border border-lime-400/40 text-lime-100 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
            <span className="break-words">{address}</span>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-surface border-2 border-dashed border-brand/50 text-center space-y-2.5">
          <Store className="w-8 h-8 text-brand mx-auto opacity-80" />
          <p className="text-sm font-extrabold text-brand">No service address yet</p>
          <p className="text-xs text-zinc-400">
            Add your default address — it is checked against our service area.
          </p>
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 min-h-11 rounded-xl bg-brand hover:bg-brand-2 text-ink font-extrabold text-xs"
          >
            Add Service Address
          </button>
        </div>
      )}

      <div className="pt-1 space-y-2 text-xs text-zinc-300">
        <div className="flex items-center justify-between gap-3">
          <span className="text-zinc-400 flex items-center space-x-1.5 shrink-0">
            <Phone className="w-3.5 h-3.5 text-lime-400" />
            <span>Customer Concierge:</span>
          </span>
          <span className="font-bold text-white truncate">{SITE.phone}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-zinc-400 flex items-center space-x-1.5 shrink-0">
            <Car className="w-3.5 h-3.5 text-brand" />
            <span>Mobile Coverage:</span>
          </span>
          <span className="font-bold text-lime-400 text-right">
            {SERVICE_AREA_CITIES.join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
}
