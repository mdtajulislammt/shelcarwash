import type { ReactNode } from 'react';

export function StepHeading({
  step,
  title,
  subtitle,
  aside,
}: {
  step: string;
  title: string;
  subtitle?: string;
  aside?: ReactNode;
}) {
  return (
    <div className={aside ? 'flex items-center justify-between' : undefined}>
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-yellow-300">{step}</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {aside}
    </div>
  );
}
