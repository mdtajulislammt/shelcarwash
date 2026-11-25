# Constant Clean – Mobile Auto Detailing (Frontend)

Booking site for Constant Clean mobile auto detailing (Dublin, San Ramon, Pleasanton, Danville,
Alamo, Walnut Creek). Vite + React 19 + TypeScript + Tailwind CSS v4, React Router, TanStack Query,
zod and zustand.

It runs fully in the browser with a **mock API** today and switches to the real backend with one
environment variable.

## Setup

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local   # optional — defaults to the mock API
npm run dev                  # http://localhost:5173
```

## Scripts

| Script              | What it does                                                 |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Vite dev server                                              |
| `npm run build`     | Type-check (`tsc --noEmit`) + production build to `dist/`    |
| `npm run preview`   | Serve the production build locally                           |
| `npm run lint`      | ESLint (typescript-eslint, react-hooks)                      |
| `npm run format`    | Prettier (write) — `format:check` to verify                  |
| `npm run typecheck` | `tsc --noEmit`                                               |
| `npm test`          | Vitest + React Testing Library (`test:watch` for watch mode) |

## Environment variables

| Variable                      | Default | Description                                                                                               |
| ----------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `VITE_USE_MOCK_API`           | `true`  | `true` = in-browser mock services (localStorage `cc_bookings_v1`, fake latency). `false` = real REST API. |
| `VITE_API_URL`                | —       | Backend base URL, e.g. `https://api.constantclean.com`. Required when `VITE_USE_MOCK_API=false`.          |
| `VITE_STRIPE_PUBLISHABLE_KEY` | —       | Reserved for Stripe (card / Google Pay) in the backend phase. Unused for now.                             |
| `VITE_GOOGLE_CLIENT_ID`       | —       | Google OAuth client ID for "Continue with Google". Empty = button hidden (email/SMS code sign-in only).   |
| `VITE_GOOGLE_MAPS_API_KEY`    | —       | Google Maps JS API key (Places API New) for address autocomplete. Empty = plain address inputs.           |

Variables are validated at startup in `src/config/env.ts`; an invalid combination throws a clear
error.

## Folder structure

```
src/
  app/         App, router, providers
  pages/       Route pages (/, /book, /gallery, /bookings, /account, /privacy, /terms, 404)
  features/    booking/ (flow, schemas, pricing), bookings/ (My Bookings), profile/ (saved profile), account/,
               gallery/, marketing/
  components/  layout/ (Navbar, MobileDock, Footer…) and ui/ (Button, Input, Modal…)
  config/      site.ts (business settings), env.ts
  data/        services catalog, gallery
  lib/         api client, LA date helpers, formatting, storage
  services/    booking / availability / payment / service-area / catalog (mock + http)
  types/       shared domain types
  styles/      index.css (theme tokens)
```

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). API: [docs/API_CONTRACT.md](docs/API_CONTRACT.md).

## Theme

Brand colors are Tailwind v4 tokens in `src/styles/index.css` (`bg-card`, `bg-brand`, `text-ink`,
`text-muted`, `accent-red`…). Selectable cards use the `.select-card` class, which turns into the
yellow gradient when `aria-checked` / `aria-pressed` is true. Components use tokens only.

## Business settings

Edit `src/config/site.ts` for phone, email, service-area cities/ZIPs, time slots, cancellation
policy, studio address and payment handles. Placeholders still to fill in:
`[BUSINESS_EMAIL]`, `[ZELLE_DETAILS]`, `[VENMO_HANDLE]`.

Prices and packages live in `src/data/services.ts`.

## Mock vs real API

- **Mock (default)** — bookings are stored in this browser's localStorage. Card/Google Pay
  "payments" succeed instantly (demo, nothing is charged); Zelle/Venmo bookings stay
  "Pending payment". Sign-in codes are shown on screen (nothing is sent); account settings and
  manual events are stored in localStorage (`cc_account_v1`); the customer profile (name, phone,
  email, address) is saved after each booking in `cc_profile_v1` and pre-fills the next one;
  "Connect to Google Wallet" (payment step) shows a "coming soon" notice. Rules are enforced like the backend will: one booking per slot, service-area
  ZIPs, 24-hour cancellation window (America/Los_Angeles).
- **Real** — set `VITE_USE_MOCK_API=false` and `VITE_API_URL`. The HTTP services call the endpoints
  in `docs/API_CONTRACT.md` and validate responses with the shared zod schemas. No UI changes needed.

## Deploy to Vercel

1. Import the repository in Vercel (framework preset: **Vite**).
2. Build command `npm run build`, output directory `dist`.
3. Add the environment variables above (Project → Settings → Environment Variables).
4. `vercel.json` rewrites all routes to `index.html`, so deep links like `/bookings` work.
