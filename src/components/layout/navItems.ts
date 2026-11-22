import { CalendarCheck, Calendar, Image, Sparkles, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  showBookingCount?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Services & Pricing', shortLabel: 'Services', icon: Sparkles },
  { to: '/book', label: 'Schedule & Pay', shortLabel: 'Schedule', icon: Calendar },
  { to: '/gallery', label: 'Gallery', shortLabel: 'Gallery', icon: Image },
  {
    to: '/bookings',
    label: 'My Bookings',
    shortLabel: 'Bookings',
    icon: CalendarCheck,
    showBookingCount: true,
  },
];
