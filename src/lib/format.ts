import { TIME_SLOTS } from '@/config/site';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** "14:00" → "2:00 PM" */
export function formatTime(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/** Slot id → arrival window label, e.g. "08:00" → "8:00–11:00 AM". */
export function formatSlotLabel(slotId: string): string {
  return TIME_SLOTS.find((s) => s.id === slotId)?.label ?? formatTime(slotId);
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}
