import { cn } from '@/components/ui/cn';
import { getInitials } from '../utils/profile';

/** Initials avatar (no photo upload yet). */
export function ProfileAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'rounded-full bg-gradient-to-br from-yellow-300 to-lime-400 text-black font-black flex items-center justify-center shrink-0',
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
