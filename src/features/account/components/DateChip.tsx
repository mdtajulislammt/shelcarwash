import { dateChipParts } from '../utils/calendar';

export function DateChip({ iso }: { iso: string }) {
  const { month, day, year } = dateChipParts(iso);
  return (
    <span className="px-2.5 py-1 rounded-lg bg-lime-400/15 border border-brand/40 font-mono text-[11px] font-extrabold flex items-center space-x-1 whitespace-nowrap shrink-0">
      <span className="text-brand font-black">{month}</span>
      <span className="text-white font-black text-xs">{day}</span>
      <span className="text-lime-400">, {year}</span>
    </span>
  );
}
