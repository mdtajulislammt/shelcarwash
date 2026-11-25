import { CalendarCheck, Calendar, Image, Sparkles, UserRound, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  showBookingCount?: boolean;
  /** Shows the customer's initials + first name once known. */
  isAccount?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Services & Pricing', shortLabel: 'Services', icon: Sparkles },
  { to: '/book', label: 'Schedule & Pay', shortLabel: 'Schedule', icon: Calendar },
  { to: '/gallery', label: 'Gallery', shortLabel: 'Gallery', icon: Image },
  {
    to: '/bookings',
    label: 'Bookings',
    shortLabel: 'Bookings',
    icon: CalendarCheck,
    showBookingCount: true,
  },
  { to: '/account', label: 'Account', shortLabel: 'Account', icon: UserRound, isAccount: true },
];
