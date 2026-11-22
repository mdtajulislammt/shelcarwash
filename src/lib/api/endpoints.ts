/** REST endpoints — see docs/API_CONTRACT.md for request/response shapes. */
export const endpoints = {
  services: '/api/services',
  availability: '/api/availability',
  serviceAreaCheck: '/api/service-area/check',
  bookings: '/api/bookings',
  booking: (id: string) => `/api/bookings/${encodeURIComponent(id)}`,
  cancelBooking: (id: string) => `/api/bookings/${encodeURIComponent(id)}/cancel`,
  paymentIntent: '/api/payments/intent',
} as const;
