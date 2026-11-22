import type { BookingStatus } from '@/types';

const LABELS: Record<BookingStatus, { text: string; className: string }> = {
  confirmed: { text: 'Confirmed & On Schedule', className: 'text-lime-400' },
  in_progress: { text: 'Detailing In Progress', className: 'text-yellow-300' },
  completed: { text: 'Completed', className: 'text-lime-400' },
  cancelled: { text: 'Cancelled', className: 'text-rose-400' },
};

const FILLED: Record<BookingStatus, number> = {
  confirmed: 1,
  in_progress: 2,
  completed: 4,
  cancelled: 0,
};
const STEPS = ['Confirmed', 'Prep & Wash', 'Polish & Protect', 'Quality Inspection'];

export function BookingProgress({ status }: { status: BookingStatus }) {
  const label = LABELS[status];
  const filled = FILLED[status];
  return (
    <div className="pt-1 space-y-1.5">
      <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
        <span>Service Status:</span>
        <span className={`${label.className} font-bold`}>{label.text}</span>
      </div>
      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden flex">
        {STEPS.map((step, i) => (
          <div
            key={step}
            title={step}
            className={`h-full w-1/4 ${
              i < filled
                ? 'bg-lime-400'
                : i === filled && status !== 'cancelled' && status !== 'completed'
                  ? 'bg-yellow-400'
                  : 'bg-zinc-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
