import { ExternalLink, MapPin } from 'lucide-react';

/** Embedded map of the customer's service address (no API key needed for the embed). */
export function ServiceMapCard({ address }: { address: string | null }) {
  const query = encodeURIComponent(address ?? 'Dublin, CA');
  return (
    <div className="bg-[#18181c] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-[#FF0000]" />
          <h3 className="text-sm font-extrabold text-white">Service Location</h3>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative text-xs text-lime-400 hover:text-lime-300 font-bold flex items-center space-x-1 after:absolute after:-inset-3 after:content-['']"
        >
          <span>Open Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="rounded-xl overflow-hidden border border-zinc-800 bg-[#0a0a0d] h-56 md:h-auto md:flex-1 md:min-h-56 relative shadow-inner">
        <iframe
          title="Service location map"
          className="absolute inset-0 w-full h-full"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(120%)' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${query}&z=${address ? 14 : 11}&ie=UTF8&iwloc=none&output=embed`}
        />
        <div className="absolute top-2 left-2 bg-[#18181c]/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-700 text-[10px] text-white font-extrabold flex items-center space-x-1.5 max-w-[85%] z-10">
          <MapPin className="w-3.5 h-3.5 text-[#FF0000] shrink-0" />
          <span className="truncate">{address ?? 'Tri-Valley service area'}</span>
        </div>
      </div>

      {!address && (
        <p className="text-[11px] text-zinc-400">
          Add your default service address in Settings, or book a mobile detail.
        </p>
      )}
    </div>
  );
}
