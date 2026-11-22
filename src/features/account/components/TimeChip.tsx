import { Clock } from 'lucide-react';

export function TimeChip({ label }: { label: string }) {
  return (
    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-lime-400/10 border border-yellow-400/40 w-fit">
      <Clock className="w-3.5 h-3.5 text-lime-400 shrink-0" />
      <span className="font-mono text-xs font-black text-white">{label}</span>
    </div>
  );
}
