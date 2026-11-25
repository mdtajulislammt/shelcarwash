import type { HTMLAttributes } from 'react';
import { cn } from './cn';

const TONES = {
  neutral: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
  lime: 'bg-lime-400/20 text-lime-300 border border-lime-400/30',
  yellow: 'bg-brand/20 text-brand border border-brand/50',
  rose: 'bg-rose-950/80 text-rose-300 border border-rose-800',
  silver:
    'font-extrabold bg-gradient-to-r from-slate-200 via-zinc-300 to-slate-400 text-ink border border-white/80 capitalize',
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof TONES;
}

export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return <span className={cn('text-[10px] px-2 py-0.5', TONES[tone], className)} {...rest} />;
}
