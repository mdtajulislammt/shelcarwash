# API Contract

REST API the frontend expects when `VITE_USE_MOCK_API=false`. All requests/responses are JSON.
Base URL: `VITE_API_URL` (e.g. `https://api.constantclean.com`).

The zod schemas in [`src/features/booking/schemas.ts`](../src/features/booking/schemas.ts) are the
source of truth — the HTTP services validate every response against them.

## Conventions

- Dates: `YYYY-MM-DD` calendar dates in **America/Los_Angeles**.
- Slot ids: `"08:00"`, `"11:00"`, `"14:00"` (arrival windows 8–11 AM, 11 AM–2 PM, 2–5 PM, LA time).
- Money: whole US dollars (`number`) on bookings; payment intents use cents (Stripe convention).
- Timestamps: ISO 8601 UTC strings.
- Auth: none yet. The client sends `Authorization: Bearer <token>` once
  `setAuthTokenProvider()` is wired (see `src/lib/api/client.ts`).

### Errors

Any non-2xx response:

```json
{ "message": "Human readable message", "code": "SLOT_UNAVAILABLE", "details": {} }
```

| Status | `code` examples                                                           |
| ------ | ------------------------------------------------------------------------- |
| 404    | `NOT_FOUND`                                                               |
| 409    | `SLOT_UNAVAILABLE`, `CANCELLATION_WINDOW_CLOSED`                          |
| 422    | `VALIDATION_ERROR`, `UNKNOWN_SERVICE`, `DATE_NOT_BOOKABLE`, `OUT_OF_AREA` |

`message` is shown to the customer as-is.

---

## GET /api/services

Catalog of vehicles, packages and add-ons.

```json
{
  "vehicles": [
    {
      "id": "sedan",
      "name": "Sedan / Coupe",
      "description": "Compact cars, sedans, 2-door coupes",
      "priceMultiplier": 1.0,
      "iconName": "Car"
    }
  ],
  "packages": [
    {
      "id": "interior-deep-clean",
      "name": "Signature Interior Sanctuary",
      "tagline": "Deep steam extraction, leather conditioning & odor elimination",
      "description": "…",
      "durationMinutes": 150,
      "basePrice": 150,
      "popular": true,
      "category": "interior",
      "features": ["Hot water carpet & upholstery shampoo extraction", "…"]
    }
  ],
  "addOns": [
    {
      "id": "headlight-restoration",
      "name": "Headlight Oxidation Restoration",
      "description": "…",
      "price": 20,
      "durationMinutes": 45,
      "icon": "Sun"
    }
  ]
}
```

`vehicles[].id` ∈ `sedan | suv | truck | exotic`.
`packages[].category` ∈ `exterior | interior | full | ceramic | maintenance`.

## GET /api/availability?date=YYYY-MM-DD

```json
{
  "date": "2026-11-25",
  "slots": [
    {
      "id": "08:00",
      "start": "08:00",
      "end": "11:00",
      "label": "8:00–11:00 AM",
      "period": "Morning",
      "available": true
    },
    {
      "id": "11:00",
      "start": "11:00",
      "end": "14:00",
      "label": "11:00 AM–2:00 PM",
      "period": "Midday",
      "available": false
    },
    {
      "id": "14:00",
      "start": "14:00",
      "end": "17:00",
      "label": "2:00–5:00 PM",
      "period": "Afternoon",
      "available": true
    }
  ]
}
```

All slots are `available: false` for dates outside tomorrow … tomorrow + 13 days (LA).

## POST /api/service-area/check

Request: `{ "zip": "94568" }`

Response:

```json
{ "zip": "94568", "serviceable": true, "city": "Dublin" }
```

Serviced ZIPs: 94568, 94582, 94583, 94566, 94588, 94526, 94506, 94507, 94595, 94596, 94597, 94598.

## POST /api/bookings

Request (`CreateBookingRequest`):

```json
{
  "serviceId": "executive-full-detail",
  "vehicleCategory": "exotic",
  "addonIds": ["headlight-restoration"],
  "date": "2026-11-25",
  "slotId": "11:00",
  "paymentMethod": "card",
  "isRecurring": false,
  "recurringFrequency": null,
  "customer": {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "(925) 555-0100",
    "serviceType": "mobile",
    "streetAddress": "1 Main St",
    "city": "Dublin",
    "zipCode": "94568",
    "vehicleMake": "Porsche",
    "vehicleModel": "911",
    "vehicleYear": "2024",
    "vehicleColor": "Black",
    "licensePlate": "7XYZ89",
    "specialNotes": ""
  }
}
```

- `paymentMethod` ∈ `card | google_pay | zelle | venmo`.
- `recurringFrequency` ∈ `weekly | bi-weekly | monthly | null`; ignored unless the package category is `maintenance`.
- For `serviceType: "mobile"`, `streetAddress`, `city` (service-area city) and `zipCode` (service-area ZIP) are required.

Server responsibilities: validate, re-check the slot (409 if taken), compute price
**server-side** (`Math.round(basePrice × vehicleMultiplier) + Σ addOn.price`), store, send the
booking confirmation (email/SMS).

Response `201` (`Booking`):

```json
{
  "id": "CC-M3X9K2ABCD12",
  "createdAt": "2026-11-22T18:00:00.000Z",
  "service": {
    "id": "executive-full-detail",
    "name": "Apex Executive Full Detail",
    "basePrice": 299,
    "durationMinutes": 240,
    "category": "full"
  },
  "vehicleCategory": "exotic",
  "addons": [
    {
      "id": "headlight-restoration",
      "name": "Headlight Oxidation Restoration",
      "price": 20,
      "durationMinutes": 45
    }
  ],
  "customer": { "…": "same as request" },
  "date": "2026-11-25",
  "slotId": "11:00",
  "totalPrice": 513,
  "estimatedDurationMinutes": 285,
  "paymentMethod": "card",
  "paymentStatus": "pending",
  "status": "confirmed",
  "isRecurring": false,
  "recurringFrequency": null,
  "transactionId": null,
  "cancelledAt": null
}
```

- `paymentStatus` ∈ `pending | paid | failed | refunded` — always `pending` on creation.
- `status` ∈ `confirmed | in_progress | completed | cancelled`.

## GET /api/bookings?email=… | ?phone=…

At least one of `email` / `phone` is required (phone as digits). Returns `Booking[]`, newest first.
(Later: replace with an authenticated `GET /api/me/bookings` or a magic-link/OTP flow.)

## GET /api/bookings/:id

Returns a `Booking`, or 404.

## POST /api/bookings/:id/cancel

No body. Returns the updated `Booking` (`status: "cancelled"`, `cancelledAt` set).

The **backend enforces the 24-hour rule**: if the appointment start (`date` + `slotId`, LA time) is
less than 24 hours away → `409 CANCELLATION_WINDOW_CLOSED`. Already cancelled / started /
completed → `409`. Paid bookings should be refunded by the backend.

## POST /api/payments/intent

Only for `card` and `google_pay`. Zelle / Venmo bookings stay `paymentStatus: "pending"` until
staff mark them paid in the admin panel.

Request:

```json
{ "bookingId": "CC-M3X9K2ABCD12", "method": "card" }
```

Response:

```json
{
  "id": "pi_3Q…",
  "bookingId": "CC-M3X9K2ABCD12",
  "amount": 51300,
  "currency": "usd",
  "status": "requires_payment_method",
  "clientSecret": "pi_3Q…_secret_…"
}
```

`status` ∈ `requires_payment_method | requires_confirmation | processing | succeeded`.
The amount comes from the stored booking, never from the client. The browser confirms the
`clientSecret` with Stripe.js (card element / Payment Request button for Google Pay); a Stripe
webhook (`payment_intent.succeeded`) sets the booking to `paymentStatus: "paid"` and
`transactionId`.
