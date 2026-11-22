import { CalendarPlus, Download, ExternalLink } from 'lucide-react';
import { downloadIcs, googleCalendarUrl } from '@/lib/calendarExport';
import type { ScheduleItem } from '../utils/schedule';
import { toCalendarEntry } from '../utils/schedule';

/** "Sync" — add one item to Google Calendar, or download it for Apple Calendar / Outlook. */
export function CalendarSyncMenu({ item }: { item: ScheduleItem }) {
  const entry = toCalendarEntry(item);
  return (
    <details className="relative shrink-0 ml-2 group">
      <summary className="list-none cursor-pointer text-lime-400 hover:text-lime-300 font-extrabold flex items-center space-x-1 text-xs min-h-8 px-1 [&::-webkit-details-marker]:hidden">
        <CalendarPlus className="w-3.5 h-3.5" />
        <span>Sync</span>
      </summary>
      <div className="absolute right-0 bottom-full mb-2 z-20 w-52 rounded-xl bg-[#18181c] border border-zinc-700 shadow-2xl p-1.5 text-xs">
        <a
          href={googleCalendarUrl(entry)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2.5 rounded-lg text-zinc-200 hover:bg-zinc-800"
        >
          <span>Google Calendar</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
        </a>
        <button
          type="button"
          onClick={() => downloadIcs(`${item.id}.ics`, [entry])}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-zinc-200 hover:bg-zinc-800"
        >
          <span>Apple / Outlook (.ics)</span>
          <Download className="w-3.5 h-3.5 text-zinc-400" />
        </button>
      </div>
    </details>
  );
}
