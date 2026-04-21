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

## Phase 5 Customer Dashboard Workspace

Phase 5 turns the authenticated customer area into a real workspace. The
dashboard pages are protected by the `/dashboard` layout guard, use Supabase
server-side queries, and render customer-owned data from the Phase 4 tables.

Authenticated customer pages:

- `/dashboard` shows workspace stats, recent shipments, recent quotes, recent
  pickup requests, and quick actions.
- `/dashboard/shipments` lists customer shipments with search, status filtering,
  route details, tracking links, ETA, and created dates.
- `/dashboard/quotes` lists saved quote calculations with lane, total, status,
  created date, and a safe `Book this shipment` link to `/book?quoteId=...`.
- `/dashboard/profile` lets the signed-in customer update profile details, view
  saved addresses, and add new saved addresses.

Phase 5 uses these existing tables only:

- `public.users`
- `public.orders`
- `public.quotes`
- `public.bookings`
- `public.addresses`

No new business tables are introduced for Phase 5. The route guard remains
server-side, and profile/address mutations use Server Actions with Zod
validation.

Every phase must end with lint, build, commit, and push to GitHub:

```bash
npm run lint
npm run build
git add .
git commit -m "Phase 5: customer dashboard workspace"
git push origin main
```

## Phase 6 Admin Panel

Phase 6 adds a real server-protected admin workspace for courier operations and
homepage content management. Admin routes are protected by
`src/app/(admin)/admin/layout.tsx`, which calls `requireAdmin()` before any
admin page renders. Admin mutations call `assertAdminAction()` on the server
before changing data.

Admin-only routes:

- `/admin`
- `/admin/shipments`
- `/admin/tracking-events`
- `/admin/quotes`
- `/admin/bookings`
- `/admin/users`
- `/admin/cms`
- `/admin/analytics`
- `/admin/settings`

Admin role protection:

- Supabase Auth remains the identity source.
- `public.users.role` controls application authorization.
- Unauthenticated admin route access redirects to `/login?next=/admin`.
- Signed-in non-admin users redirect to `/dashboard`.
- Admin Server Actions reject non-admin mutation attempts with safe messages.

Run the Phase 6 migration before using the admin CMS/settings features:

```bash
supabase db push
```

The migration `supabase/migrations/004_phase6_admin_panel.sql` creates or
updates:

- `public.cms_content`
- `public.site_settings`
- admin RLS policies for CMS, settings, and operational tables
- public read policies for published CMS content
- the public `cms-assets` Supabase Storage bucket and admin upload policies
- lightweight indexes for operations queries

CMS assets upload to the `cms-assets` bucket and return public URLs for homepage
and future content media fields. Stripe, Resend, Mapbox, public homepage
redesign, and blog publishing remain outside this phase.

## Phase 7 Remaining Public Pages and SEO Foundation

Phase 7 completes the public marketing and content surface and adds a
production-style SEO layer using Next.js App Router metadata conventions. It
does not add Stripe, Resend, Mapbox, new dashboard workflows, or complex blog
publishing.

Production-ready public content routes:

- `/services`
- `/about`
- `/contact`
- `/faq`
- `/privacy`
- `/terms`
- `/blog`
- `/blog/[slug]`
- `/not-found`

SEO features added:

- Root metadata with `metadataBase`, title template, Open Graph, Twitter, and
  robots defaults.
- Route-level metadata and canonical URLs for public pages.
- Dynamic `generateMetadata` for blog article pages.
- Organization, WebSite, FAQPage, and BlogPosting JSON-LD helpers rendered
  through `SeoJsonLd`.
- `src/app/sitemap.ts` with static public routes and blog article URLs.
- `src/app/robots.ts` that allows public pages and disallows admin,
  dashboard, auth, and account-only routes.
- File-based generated social previews through `src/app/opengraph-image.tsx`
  and `src/app/twitter-image.tsx`.

The blog uses a hybrid data strategy. `src/lib/queries/blog.ts` attempts to
read published rows from a future `blog_posts` table when Supabase is available,
then falls back to polished demo logistics articles from
`src/content/blog-fallback.ts`.

Public page settings use `src/lib/queries/public-pages.ts` to attempt reading
`company_contact`, `support_hours`, `social_links`, and `footer_notice` from
`site_settings`. Missing settings, unavailable Supabase configuration, or RLS
errors gracefully fall back to constants in `src/constants/site.ts`.

Every phase must end with lint, build, commit, and push to GitHub:

```bash
npm run lint
npm run build
git add .
git commit -m "Phase 7: remaining public pages and SEO foundation"
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
- `/privacy`
- `/terms`
- `/blog`
- `/blog/[slug]`

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

Recommended next steps are payment, email notification, map/geocoding, and
production legal review work once those integrations are intentionally scoped.
