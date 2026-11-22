import { ShieldCheck } from 'lucide-react';
import { CANCELLATION_POLICY } from '@/config/site';
import { cn } from '@/components/ui/cn';

export function CancellationPolicy({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'p-3 rounded-xl bg-[#050505] border border-zinc-800 text-xs text-zinc-300 flex items-start space-x-2',
        className,
      )}
    >
      <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
      <p>
        <span className="font-bold text-white">Cancellation policy: </span>
        {CANCELLATION_POLICY.text}
      </p>
    </div>
  );
}
