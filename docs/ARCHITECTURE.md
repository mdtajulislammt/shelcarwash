# Architecture

## Goals

- Keep the client-approved design pixel-identical while making the code easy to grow.
- Feature-based folders: everything a feature needs lives together.
- The UI never talks to `fetch` or `localStorage` directly — only through hooks → services.
- A mock backend today, a real backend tomorrow, with **no UI changes** (flip one env var).

## Folder structure

```
src/
  app/          App.tsx, router.tsx, providers.tsx (QueryClient), RootLayout, ScrollToTop
  pages/        Route components: Home, Booking, Gallery, MyBookings, Account, Privacy, Terms, NotFound
  features/
    booking/    Booking flow (vehicle → package → add-ons → schedule → details → checkout)
      components/          VehicleSelector, PackageSelector, AddOns, Recurring, Scheduler,
                           CustomerForm, BookingForm, checkout/{Review, Payment, Confirmation}
      hooks/               useCatalog, useAvailability, useCreateBooking, useServiceAreaCheck,
                           useBookingSelection (derived price/duration)
      store/               bookingStore (zustand) — flow state shared by "/" and "/book"
      utils/               pricing.ts, serviceArea.ts (+ tests)
      schemas.ts           zod schemas = form validation = API contract types
    bookings/   "My Bookings": list, details, cancel (useBookings, useCancelBooking, lookupStore)
    account/    "My Account" (/account): profile header, appointment calendar, service-location
                map, upcoming appointments, verified address. Derived from the customer's bookings
                + saved profile (useAccount). Settings modal (profile fields + notifications),
                Add Manual Event, calendar sync (Google Calendar link / .ics via
                lib/calendarExport.ts).
    profile/    Saved customer profile (name, phone, email, service address). zustand persisted
                store (localStorage "cc_profile_v1") behind services/profileService; hooks
                useProfile / useSaveProfile / useClearProfile / useProfileForm /
                usePrefillFromProfile. Saved automatically after each booking (useCreateBooking),
                pre-fills the next booking ("Using your saved profile" + Edit), and can be
                viewed / edited / cleared on My Bookings (ProfileSection).
    auth/       Passwordless sign-in: SignInForm (email/SMS one-time code) + GoogleSignInButton
                (Google Identity Services, shown when VITE_GOOGLE_CLIENT_ID is set). Session
                (contact + token) lives in bookings/store/lookupStore and is sent as Bearer token.
    gallery/    BeforeAfterGallery
    marketing/  Hero
  components/
    layout/     AppLayout, Navbar, MobileDock, Footer, Container, LegalPage
    ui/         Button, Card, Badge, Input, Select, Modal, Toast, Spinner,
                AddressAutocompleteInput (Google Places)
  config/       site.ts (business config), env.ts (validated import.meta.env)
  data/         services.ts (catalog), gallery.ts
  lib/          api/{client, endpoints, queryKeys}, dates.ts (LA time), format.ts, storage.ts,
                googleMaps.ts (lazy Places loader + address parsing), calendarExport.ts
  services/     catalog / availability / serviceArea / booking / payment / auth / account /
                profile services
                (interface + mock + http), index.ts picks the implementation
  types/        Shared domain types
  styles/       index.css (brand tokens, .select-card)
  test/         Vitest setup
```

## Data flow

```
Component ──► hook (TanStack Query) ──► service interface ──► mock (localStorage)
                                                         └──► http (lib/api/client → REST API)
```

- **Components** read flow state from `useBookingStore` and server state from hooks.
- **Hooks** (`useBookings`, `useCreateBooking`, `useCancelBooking`, `useAvailability`, …) own
  caching, loading/error states and cache invalidation (`lib/api/queryKeys.ts`).
- **Services** (`src/services/*Service.ts`) each export an interface plus
  `createMock…()` and `createHttp…()`. `src/services/index.ts` chooses one with
  `VITE_USE_MOCK_API`.
- **Mock services** store bookings in `localStorage` (`cc_bookings_v1`), add fake latency and
  enforce the same rules the backend will (slot conflicts, service area, 24h cancellation).
- **HTTP services** call `lib/api/client.ts`, a typed `fetch` wrapper (base URL, JSON, `ApiError`,
  auth-token hook) and validate responses with the zod schemas.

### Booking flow

1. `/` — VehicleSelector, PackageSelector, AddOns, Recurring (maintenance packages only) write to
   `bookingStore`. `useBookingSelection` derives price (`pricing.ts`) and duration.
2. `/book` — Scheduler (dates: tomorrow + 13 days in LA; 3 slots from `useAvailability`),
   ServiceLocation, VehicleSpecsFields, CustomerForm. Submit validates with `customerSchema`,
   double-checks the ZIP via `useServiceAreaCheck`, then opens the checkout modal.
3. Checkout — Review (summary + cancellation policy) → Payment (card / Google Pay / Zelle / Venmo)
   → `useCreateBooking`: `POST /bookings`, then for card/Google Pay `POST /payments/intent`.
   Zelle/Venmo stay "Pending payment".
4. Confirmation → `/bookings`. The customer's email/phone is remembered (`lookupStore`) so
   My Bookings can query `GET /bookings?email=`.

### Theme

`src/styles/index.css` defines the brand tokens (Tailwind v4 `@theme`): `card` #4B4B4B,
`card-hover` #555555, `brand` #F4F015, `brand-2` #D9D50F, `accent-red` #F15543, `ink` #20201F,
`muted` #E5E5E5, plus dark `page` / `surface-*` backgrounds. Components use token classes only.
`.select-card` styles every selectable card (gray card, 12px radius, card shadow) and switches to
the yellow gradient with ink text when `aria-checked`/`aria-pressed` is true; children use
`text-card-fg`, `text-card-muted`, `text-card-accent`, `bg-card-chip` so they flip with it. Focus
ring = brand yellow (`:focus-visible`). Active nav item = 2px `accent-red` underline.

### Summary bar

`BookingSummaryBar` is `position: sticky; bottom: 6rem` inside the services section, so it stays
visible while choosing vehicle, package and add-ons and comes to rest after the last step (never
over the footer). The layout root uses `overflow-x: clip` (not `hidden`) so sticky keeps working.

### Address autocomplete

`AddressAutocompleteInput` lazy-loads the Maps JS API (`lib/googleMaps.ts`, key
`VITE_GOOGLE_MAPS_API_KEY`) on first focus and uses Places API (New)
`AutocompleteSuggestion` (US only, biased to the Tri-Valley). Choosing a suggestion fills street,
city, state and ZIP and runs the service-area check through `serviceAreaService`. No key, a script
error or an API error → it stays a plain input.

### Business rules (where they live)

| Rule                                            | Code                                                     |
| ----------------------------------------------- | -------------------------------------------------------- |
| Price = round(base × multiplier) + add-ons      | `features/booking/utils/pricing.ts`                      |
| LA time zone, date window, DST-safe conversions | `lib/dates.ts`                                           |
| Slots, service area, policy, payment handles    | `config/site.ts`                                         |
| ZIP / city validation                           | `features/booking/utils/serviceArea.ts`, `schemas.ts`    |
| 24h cancellation                                | `features/bookings/utils/cancellation.ts` (UI) + backend |

The backend must re-implement price, slot, ZIP and cancellation checks — the frontend checks are
for UX only.

## Plugging in the backend

1. Implement the endpoints in [API_CONTRACT.md](./API_CONTRACT.md).
2. Set `VITE_API_URL=https://api…` and `VITE_USE_MOCK_API=false` (Vercel → Environment Variables).
3. Enable CORS for the frontend origin.
4. Payments: add `@stripe/stripe-js`, use `VITE_STRIPE_PUBLISHABLE_KEY`, and in
   `useCreateBooking` confirm the returned `clientSecret` before re-fetching the booking.
5. Auth (optional): call `setAuthTokenProvider(() => token)` at startup; the client adds
   `Authorization: Bearer …` to every request.

No component changes are needed — only services/hooks.

## Planned backend

- **API**: Node.js — NestJS (preferred for structure/validation) or Express — TypeScript.
- **Database**: PostgreSQL (Prisma or TypeORM). Tables: customers, vehicles, bookings,
  booking_addons, payments, service_areas, slots/blackouts, certificates, admin_users.
- **Payments**: Stripe PaymentIntents (card + Google Pay via Payment Request), webhooks for
  `payment_intent.succeeded` / refunds on cancellation.
- **Notifications**: Twilio SMS (confirmation, day-before reminder, "on the way"), transactional
  email (SendGrid/Postmark/Resend) for booking confirmation and the digital service certificate.
- **Admin panel**: bookings calendar, mark Zelle/Venmo paid, update status
  (in_progress/completed), issue certificates, manage prices/slots/ZIPs.
- **Scheduling**: annual pass bookings generate the recurring schedule automatically.
- Enforce slot capacity with a unique constraint on (date, slot_id) for active bookings.
