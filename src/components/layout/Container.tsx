import type { HTMLAttributes } from 'react';
import { cn } from '@/components/ui/cn';

/** Page-width wrapper: max-w-7xl with the original responsive gutters. */
export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)} {...rest} />;
}
