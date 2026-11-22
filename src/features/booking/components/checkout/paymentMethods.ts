import { Banknote, CreditCard, Send, Smartphone, type LucideIcon } from 'lucide-react';
import { PAYMENT_HANDLES } from '@/config/site';
import type { PaymentMethod } from '@/types';

export interface PaymentMethodOption {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  /** Instant (Stripe) vs manual transfer confirmed by staff. */
  kind: 'instant' | 'manual';
  handle?: string;
}

export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  {
    id: 'card',
    title: 'Visa / Mastercard',
    subtitle: 'Pay now • Instant confirmation',
    icon: CreditCard,
    kind: 'instant',
  },
  {
    id: 'google_pay',
    title: 'Google Pay',
    subtitle: 'Pay now • Instant confirmation',
    icon: Smartphone,
    kind: 'instant',
  },
  {
    id: 'zelle',
    title: 'Zelle',
    subtitle: 'Send payment • Confirmed by our team',
    icon: Banknote,
    kind: 'manual',
    handle: PAYMENT_HANDLES.zelle,
  },
  {
    id: 'venmo',
    title: 'Venmo',
    subtitle: 'Send payment • Confirmed by our team',
    icon: Send,
    kind: 'manual',
    handle: PAYMENT_HANDLES.venmo,
  },
];

export function getPaymentMethodOption(id: PaymentMethod): PaymentMethodOption {
  return PAYMENT_METHOD_OPTIONS.find((m) => m.id === id) ?? PAYMENT_METHOD_OPTIONS[0];
}
