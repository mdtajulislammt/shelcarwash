/** REST endpoints — see docs/API_CONTRACT.md for request/response shapes. */
export const endpoints = {
  services: '/api/services',
  availability: '/api/availability',
  serviceAreaCheck: '/api/service-area/check',
  bookings: '/api/bookings',
  booking: (id: string) => `/api/bookings/${encodeURIComponent(id)}`,
  cancelBooking: (id: string) => `/api/bookings/${encodeURIComponent(id)}/cancel`,
  paymentIntent: '/api/payments/intent',
  authRequestCode: '/api/auth/code',
  authVerifyCode: '/api/auth/verify',
  authGoogle: '/api/auth/google',
  accountSettings: '/api/me/settings',
  accountEvents: '/api/me/events',
  accountEvent: (id: string) => `/api/me/events/${encodeURIComponent(id)}`,
  walletSaveLink: '/api/wallet/save-link',
} as const;
