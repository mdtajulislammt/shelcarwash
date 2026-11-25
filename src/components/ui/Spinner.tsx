import { Loader2 } from 'lucide-react';
import { cn } from './cn';

export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden className={cn('animate-spin text-brand', className ?? 'w-5 h-5')} />;
}
