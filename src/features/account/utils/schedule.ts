import { TIME_SLOTS } from '@/config/site';
import type { CalendarEntry } from '@/lib/calendarExport';
import { formatTime } from '@/lib/format';
import type { Booking } from '@/types';
import type { ManualEvent } from '../schemas';
import { formatServiceAddress, formatVehicle } from './profile';

/** A booking or a personal event, shown together on the account calendar. */
export interface ScheduleItem {
  id: string;
  kind: 'booking' | 'manual';
  date: string;
  startTime: string;
  endTime: string;
  timeLabel: string;
  title: string;
  vehicle: string;
  location: string;
  statusLabel: string;
  sourceId: string;
}

const STATUS_TEXT: Record<Booking['status'], string> = {
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function bookingToScheduleItem(b: Booking, studioAddress: string): ScheduleItem {
  const slot = TIME_SLOTS.find((s) => s.id === b.slotId);
  return {
    id: `booking-${b.id}`,
    kind: 'booking',
    date: b.date,
    startTime: slot?.start ?? b.slotId,
    endTime: slot?.end ?? b.slotId,
    timeLabel: slot?.label ?? formatTime(b.slotId),
    title: b.service.name,
    vehicle: formatVehicle(b.customer),
    location:
      b.customer.serviceType === 'mobile' ? formatServiceAddress(b.customer) : studioAddress,
    statusLabel: b.paymentStatus === 'pending' ? 'Pending Payment' : STATUS_TEXT[b.status],
    sourceId: b.id,
  };
}

export function eventToScheduleItem(e: ManualEvent): ScheduleItem {
  return {
    id: `manual-${e.id}`,
    kind: 'manual',
    date: e.date,
    startTime: e.startTime,
    endTime: e.endTime,
    timeLabel: `${formatTime(e.startTime)}–${formatTime(e.endTime)}`,
    title: e.title,
    vehicle: e.vehicle,
    location: e.location,
    statusLabel: 'Personal',
    sourceId: e.id,
  };
}

/** Upcoming items (today or later), soonest first. */
export function buildSchedule(
  bookings: Booking[],
  events: ManualEvent[],
  today: string,
  studioAddress: string,
): ScheduleItem[] {
  return [
    ...bookings.map((b) => bookingToScheduleItem(b, studioAddress)),
    ...events.map(eventToScheduleItem),
  ]
    .filter((i) => i.date >= today)
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
}

export function toCalendarEntry(item: ScheduleItem): CalendarEntry {
  const details = [
    item.kind === 'booking' ? `Booking #${item.sourceId} — Constant Clean` : '',
    item.vehicle ? `Vehicle: ${item.vehicle}` : '',
  ].filter(Boolean);
  return {
    uid: item.id,
    title: item.kind === 'booking' ? `Constant Clean: ${item.title}` : item.title,
    date: item.date,
    startTime: item.startTime,
    endTime: item.endTime,
    location: item.location || undefined,
    description: details.join('\n') || undefined,
  };
}
