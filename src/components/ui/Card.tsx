import type { HTMLAttributes } from 'react';
import { cn } from './cn';

/** Dark panel used for the scheduler, gallery cards and modals. */
export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-[#0f0f13] border border-zinc-800', className)} {...rest} />;
}
