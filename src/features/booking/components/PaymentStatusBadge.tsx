import { Badge } from '@/components/ui/Badge';
import type { PaymentStatus } from '@/types';

const LABELS: Record<PaymentStatus, string> = {
  paid: 'Paid',
  pending: 'Pending payment',
  failed: 'Payment failed',
  refunded: 'Refunded',
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const tone = status === 'paid' ? 'lime' : status === 'pending' ? 'yellow' : 'rose';
  return (
    <Badge tone={tone} className="rounded font-bold uppercase tracking-wider whitespace-nowrap">
      {LABELS[status]}
    </Badge>
  );
}
