import { env } from '@/config/env';
import { useLookupStore } from '@/features/bookings/store/lookupStore';
import { createHttpAccountService, createMockAccountService } from './accountService';
import { createHttpAuthService, createMockAuthService } from './authService';
import {
  createHttpAvailabilityService,
  createMockAvailabilityService,
} from './availabilityService';
import { createHttpBookingService, createMockBookingService } from './bookingService';
import { createHttpCatalogService, createMockCatalogService } from './catalogService';
import { createHttpPaymentService, createMockPaymentService } from './paymentService';
import { createHttpProfileService, createLocalProfileService } from './profileService';
import { createHttpServiceAreaService, createMockServiceAreaService } from './serviceAreaService';

/** Picks mock or HTTP implementations from VITE_USE_MOCK_API. */
const useMock = env.useMockApi;

export const catalogService = useMock ? createMockCatalogService() : createHttpCatalogService();
export const availabilityService = useMock
  ? createMockAvailabilityService()
  : createHttpAvailabilityService();
export const serviceAreaService = useMock
  ? createMockServiceAreaService()
  : createHttpServiceAreaService();
export const bookingService = useMock ? createMockBookingService() : createHttpBookingService();
export const paymentService = useMock ? createMockPaymentService() : createHttpPaymentService();
export const authService = useMock ? createMockAuthService() : createHttpAuthService();
export const accountService = useMock ? createMockAccountService() : createHttpAccountService();
export const profileService = useMock
  ? createLocalProfileService()
  : createHttpProfileService(() => !!useLookupStore.getState().token);

export type { AccountService } from './accountService';
export type { AuthService } from './authService';
export type { AvailabilityService } from './availabilityService';
export type { BookingService } from './bookingService';
export type { CatalogService } from './catalogService';
export type { PaymentService } from './paymentService';
export type { ProfileService } from './profileService';
export type { ServiceAreaService } from './serviceAreaService';
