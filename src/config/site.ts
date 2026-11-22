import type { TimeSlot } from '@/types';

/**
 * Business configuration. Values in [BRACKETS] are placeholders the client
 * still has to provide.
 */
export const SITE = {
  name: 'Constant Clean',
  legalName: 'Constant Clean Auto Detailing',
  longName: 'Constant Clean Auto Detailing Studio & Mobile Concierge',
  phone: '[BUSINESS_PHONE]',
  email: '[BUSINESS_EMAIL]',
  timeZone: 'America/Los_Angeles',
  /** Studio drop-off address shown in the "Service Location" step (client to confirm). */
  studioAddress: '1080 Detailing Way, LA',
} as const;

/** ZIP → city for every ZIP code we service. */
export const SERVICE_AREA_ZIPS: Readonly<Record<string, ServiceAreaCity>> = {
  '94568': 'Dublin',
  '94582': 'San Ramon',
  '94583': 'San Ramon',
  '94566': 'Pleasanton',
  '94588': 'Pleasanton',
  '94526': 'Danville',
  '94506': 'Danville',
  '94507': 'Alamo',
  '94595': 'Walnut Creek',
  '94596': 'Walnut Creek',
  '94597': 'Walnut Creek',
  '94598': 'Walnut Creek',
};

export const SERVICE_AREA_CITIES = [
  'Dublin',
  'San Ramon',
  'Pleasanton',
  'Danville',
  'Alamo',
  'Walnut Creek',
] as const;
export type ServiceAreaCity = (typeof SERVICE_AREA_CITIES)[number];

export const SERVICE_AREA_ERROR =
  "Sorry, we don't service this ZIP code yet. We serve Dublin, San Ramon, Pleasanton, Danville, Alamo & Walnut Creek.";

/** Three fixed arrival windows, 7 days a week (America/Los_Angeles). */
export const TIME_SLOTS: readonly TimeSlot[] = [
  { id: '08:00', start: '08:00', end: '11:00', label: '8:00–11:00 AM', period: 'Morning' },
  { id: '11:00', start: '11:00', end: '14:00', label: '11:00 AM–2:00 PM', period: 'Midday' },
  { id: '14:00', start: '14:00', end: '17:00', label: '2:00–5:00 PM', period: 'Afternoon' },
];

/** Number of bookable days, starting tomorrow (LA time). */
export const BOOKING_WINDOW_DAYS = 14;

export const CANCELLATION_POLICY = {
  freeCancellationHours: 24,
  text: "Free cancellation up to 24 hours before your appointment. Not satisfied? We'll come back and re-service at no charge.",
} as const;

/** Manual payment handles shown for Zelle / Venmo (client to provide). */
export const PAYMENT_HANDLES = {
  zelle: '[ZELLE_DETAILS]',
  venmo: '[VENMO_HANDLE]',
} as const;
