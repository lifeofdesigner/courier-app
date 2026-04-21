# Atlas Courier MVP

Production-style courier company web app MVP built with Next.js App Router,
TypeScript, Tailwind CSS, and Supabase-ready project structure.

## Phase 1 Scaffold

This phase establishes the application structure and design foundation only. It
does not connect Supabase, implement authentication, create shipment business
logic, or add operational workflows.

### Current Structure

- `src/app/(public)` contains the customer-facing routes: home, tracking, quote,
  pickup booking, services, about, contact, and FAQ.
- `src/app/(auth)` contains the authentication routes: login, sign up, and
  forgot password.
- `src/app/(customer)` contains the dashboard-based customer account routes:
  dashboard, shipments, quotes, and profile.
- `src/app/(admin)` contains admin routes for shipment, tracking event, quote,
  booking, user, and CMS management.
- `src/components/ui` contains the reusable design system primitives.
- `src/components/layout` contains the responsive site shell, header, footer,
  logo, and container system.
- `src/constants/site.ts` centralizes brand tokens, navigation, company details,
  CTA labels, service previews, and trust signals.
- `src/types` contains shared UI types and future shipment, quote, tracking, and
  booking entity types.

### Design System

The scaffold includes reusable components for:

- Button
- Input
- Textarea
- Select
- Card
- Badge
- Section heading
- Page hero

The visual direction uses a clean courier/logistics aesthetic with a light
background, navy hierarchy, orange primary accent, strong spacing rhythm, and
business-ready copy.

## Phase 3 Homepage CMS Foundation

The homepage is now driven by structured CMS content instead of inline marketing
copy. The server route fetches homepage section records through
`src/lib/queries/cms.ts`, validates each section payload, and renders typed
marketing components from `src/components/marketing`.

Required Supabase environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

If either variable is missing, the Supabase request fails, or no published
homepage records exist, the homepage renders `src/content/homepage-fallback.ts`
so the public site remains available.

The Phase 3 CMS table assumption is a section-record model using a
`cms_content` table:

```ts
{
  section: "homepage";
  key:
    | "hero"
    | "trackingPromo"
    | "services"
    | "trust"
    | "coverage"
    | "testimonials"
    | "faqPreview"
    | "cta"
    | "seo";
  value: Json;
  published: boolean;
  updated_at: string;
}
```

Each `value` is the full JSON payload for that homepage section and should match
the interfaces in `src/types/cms.ts`.

## Phase 4 Auth, Tracking, Quote, and Booking MVP

Phase 4 adds the working MVP flows for Supabase Auth, protected customer
dashboard access, public shipment tracking, quote calculation, and pickup
booking requests. It does not include admin CRUD, Stripe, Resend, Mapbox,
dashboard analytics, or CMS editing UI.

Auth and public Supabase environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_SITE_URL` is used for Supabase Auth redirect URLs. If it is not
set, the app falls back to `http://localhost:3000` locally.

Run the Phase 4 migration before testing database-backed flows:

```bash
supabase db push
```

The migration `supabase/migrations/002_phase4_auth_tracking_quote_booking.sql`
creates or extends:

- `public.users`
- `public.orders`
- `public.tracking_events`
- `public.pricing_rules`
- `public.quotes`
- `public.addresses`
- `public.bookings`

It also adds profile sync from `auth.users`, RLS policies for customer-owned
data, constrained public tracking access, guest quote/booking inserts, and
starter pricing rules for Express and Economy EU/International quotes.

This project uses Next.js 16, so session refresh is implemented in `proxy.ts`
rather than `middleware.ts`. Do not create both files for this project version.

Phase 4 should end with lint, build, commit, and push:

```bash
npm run lint
npm run build
git add .
git commit -m "Phase 4: auth tracking quote and booking MVP"
git push origin main
```

## Routes

Public:

- `/`
- `/track`
- `/quote`
- `/book`
- `/services`
- `/about`
- `/contact`
- `/faq`

Auth:

- `/login`
- `/sign-up`
- `/forgot-password`

Customer:

- `/dashboard`
- `/dashboard/shipments`
- `/dashboard/quotes`
- `/dashboard/profile`

Admin:

- `/admin`
- `/admin/shipments`
- `/admin/tracking-events`
- `/admin/quotes`
- `/admin/bookings`
- `/admin/users`
- `/admin/cms`

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Run checks:

```bash
npm run lint
npm run build
```

## Next Phase

Recommended next steps are database schema hardening, Supabase Auth integration,
and real shipment, quote, booking, and tracking workflows.
