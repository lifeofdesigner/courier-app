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
- Unauthenticated admin route access redirects to `/admin/login`.
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

## Phase 8 Payments, Emails, Labels, and Final QA

Phase 8 completes the launch-ready MVP flow with server-side Stripe Checkout,
verified Stripe webhooks, Resend transactional emails, printable HTML shipping
labels, payment-aware dashboard/admin states, and final production readiness
checks.

Phase 8 adds:

- Server-created Stripe Checkout Sessions at `/api/stripe/checkout`.
- Verified Stripe webhook handling at `/api/stripe/webhook`.
- Booking payment success and cancel routes at `/book/success` and
  `/book/cancel`.
- Webhook-driven paid fulfillment that marks bookings paid, creates one linked
  order if missing, creates an initial tracking event, and stores `/label/{id}`
  as the label URL.
- Resend email helpers and templates for booking confirmation, payment
  confirmation, and operational tracking status updates.
- A printable label route at `/label/[bookingId]`.
- Admin settings environment readiness checks for launch configuration.

Stripe environment variables:

```bash
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

Supabase trusted server-side payment operations also require:

```bash
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. It is used only by
server-side route handlers and queries so webhook fulfillment can update RLS
protected tables safely.

Resend environment variables:

```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

If Resend variables are missing, booking/payment/status flows continue and email
sending is skipped gracefully.

Recommended public URL configuration:

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

Stripe webhook setup:

- Endpoint URL: `https://your-production-domain.com/api/stripe/webhook`
- Required events:
  - `checkout.session.completed`
  - `checkout.session.expired`
  - `payment_intent.payment_failed`

Payment flow overview:

1. A customer or guest creates a booking at `/book`.
2. The booking stores `amount_due`, `currency`, and `payment_status = unpaid`.
3. The customer starts Checkout through `/api/stripe/checkout`.
4. The app stores `payment_status = checkout_created` and the Stripe Checkout
   Session ID.
5. Stripe redirects to `/book/success` or `/book/cancel`, but those pages do not
   perform fulfillment.
6. The verified webhook marks successful payments as paid, creates a linked
   order if one does not already exist, creates the initial tracking event,
   stores the label URL, and sends the payment confirmation email.

Label printing:

- Printable labels are served at `/label/[bookingId]`.
- The label route renders only after payment is marked paid and an order exists.
- The route is intentionally noindex and uses the unguessable booking UUID as
  the MVP access token for guest label printing.
- Labels are HTML/CSS print views; no carrier API or PDF service is introduced
  in this phase.

Run the Phase 8 migration before testing payments:

```bash
supabase db push
```

The migration `supabase/migrations/005_phase8_payments_emails_labels.sql`
creates or updates:

- payment fields on `public.bookings`
- label fields on `public.bookings`
- `booking_id` and label fields on `public.orders`
- payment status checks and payment/order indexes
- payment-safe booking insert RLS policies
- existing owner/admin order and booking policies

Final QA checklist:

- Auth: sign up, sign in, dashboard guard, admin guard.
- Quote: calculate and save an Express and Economy quote.
- Booking: create signed-in and guest bookings with an amount due.
- Stripe checkout: start Checkout from booking success, dashboard, and cancel
  resume states.
- Webhook: confirm `checkout.session.completed` marks the booking paid and
  creates one linked order only.
- Email: booking confirmation, payment confirmation, and status update emails
  send when Resend env is configured and skip safely when it is not.
- Admin role: verify `/admin`, bookings, shipments, settings, CMS, and user role
  screens remain admin-only.
- CMS publish: published homepage CMS content still renders with fallback safety.
- Tracking: paid shipment tracking shows status and label access.
- Label printing: `/label/[bookingId]` prints a clean label after payment.
- Public SEO pages: services, about, contact, FAQ, legal, blog, sitemap, robots,
  and social images still build.
- GitHub push completed after lint and build pass.

Every phase must end with lint, build, commit, and push to GitHub:

```bash
npm run lint
npm run build
git add .
git commit -m "Phase 8: payments emails labels and final QA"
git push origin main
```

## Admin Create-User Patch

The admin workspace includes a dedicated user creation tool at
`/admin/users/create`. It lets an existing admin create a Supabase Auth user,
set full name, phone, email, password, and assign either the `customer` or
`admin` role at creation time.

Required server-only environment variable:

```bash
SUPABASE_SERVICE_ROLE_KEY=
```

The create-user action is admin-only and server-side. It calls the existing
admin authorization guard before doing any work, uses a service-role Supabase
client only on the server, and creates users with
`supabase.auth.admin.createUser()`. Locally created users are email-confirmed
immediately with `email_confirm: true` so they can log in during desktop
testing.

After auth user creation, the action updates `public.users` with `full_name`,
`phone`, `role`, and `updated_at` so the profile row stays aligned with the
selected role.

This focused patch must end with lint, build, commit, and push to GitHub:

```bash
npm run lint
npm run build
git add .
git commit -m "Patch: admin create user page with role assignment"
git push origin main
```

## Header Account Access Patch

The public header and mobile navigation now surface account access as a primary
action. Logged-out visitors see `Sign in`, authenticated customers see
`My Account`, and authenticated admins see `Admin`. Account state is resolved
server-side from Supabase Auth plus the `public.users.role` profile field.

## Separate Auth Entry and Developer Bootstrap Patch

Customer and admin access now use separate entry routes:

- `/login` is the customer login route. Successful sign-in redirects to a safe
  `next` path when present, otherwise `/dashboard`.
- `/admin/login` is the admin login route. Successful sign-in checks
  `public.users.role` and redirects only admins to `/admin`; non-admin accounts
  receive a safe error and are not granted admin entry.

The private developer bootstrap tool is available at
`/developer/bootstrap-users` only when server-side protection passes. It is not
linked from public or admin navigation. The page requires the bootstrap feature
flag, a configured secret, Supabase service-role configuration, and a
server-validated signed HTTP-only access cookie before user creation is allowed.

Required developer bootstrap environment variables:

```bash
DEV_BOOTSTRAP_ENABLED=true
DEV_BOOTSTRAP_SECRET=
DEV_BOOTSTRAP_LOCAL_ONLY=true
SUPABASE_SERVICE_ROLE_KEY=
```

`DEV_BOOTSTRAP_LOCAL_ONLY` is optional but recommended for local-only setup
work. Keep `DEV_BOOTSTRAP_ENABLED` disabled in production unless the bootstrap
tool is intentionally needed, and never expose `SUPABASE_SERVICE_ROLE_KEY` in
browser code.

Bootstrap-created users are created server-side with
`serviceRoleClient.auth.admin.createUser()`, email-confirmed for local testing,
and then assigned `customer` or `admin` in `public.users`.

This focused patch ends with lint, build, commit, and push to GitHub:

```bash
npm run lint
npm run build
git add .
git commit -m "Patch: separate customer admin login and developer bootstrap"
git push origin main
```

## Admin CMS UX Rebuild Patch

The `/admin/cms` page now presents a field-based editor instead of raw
section/key/JSON rows. Admins edit grouped content areas with plain labels,
inline image pickers, preview states, per-section save buttons, and explicit
Draft/Published controls.

CMS groups now shown in the editor:

- Site Identity
- Homepage
- Services Page
- About Page
- Contact Info
- FAQ
- Footer
- SEO

Homepage editing is split into Hero, Tracking Promo, Services Preview, Trust
Section, Coverage Section, Testimonials / Social Proof, FAQ Preview, CTA, and
homepage SEO. The server actions still write compatible `cms_content` payloads
for the existing homepage model. Published site identity, contact, and footer
records sync back into `site_settings` so current public contact/header/footer
readers continue to work.

## Admin Shipment Workspace Patch

The `/admin/shipments` area is now an operations workspace for courier staff.
Orders remain the shipment source of truth, with linked `bookings`,
`addresses`, `tracking_events`, and payment fields used for the full admin view.

Admin shipment routes:

- `/admin/shipments` lists shipments with sender, recipient, route, service,
  shipment status, payment status, label state, and operational actions.
- `/admin/shipments/create` lets admins manually create unassigned or
  customer-linked shipments. Tracking numbers are generated automatically.
- `/admin/shipments/[id]` is the main shipment management page with overview,
  contacts, pickup and delivery addresses, package details, booking/payment
  summary, status updates, label/public tracking actions, and timeline event
  creation.

The migration `supabase/migrations/006_admin_shipment_workspace.sql` adds the
narrow RLS correction needed for admins to insert linked booking records during
manual shipment creation, plus operational indexes for shipment queues.

## Mode-Aware Shipping Terminology Patch

Shipment status display and transport-mode options are centralized in
`src/lib/shipping/statuses.ts`. Admin, customer dashboard, public tracking,
tracking emails, and analytics now render Air, Road, and Freight logistics
terminology instead of raw stored codes.

Supported transport modes:

- `air` - Air
- `road` - Road
- `freight` - Freight

Mode-aware service types:

- `express_air` - Express Air
- `standard_air` - Standard Air
- `priority_air_cargo` - Priority Air Cargo
- `same_day_road` - Same-Day Road
- `regional_road` - Regional Road
- `standard_road` - Standard Road
- `ltl_freight` - LTL Freight
- `full_truckload` - Full Truckload
- `pallet_freight` - Pallet Freight
- `consolidated_freight` - Consolidated Freight

Common shipment statuses:

- `shipment_created` - Shipment Created
- `booking_confirmed` - Booking Confirmed
- `pickup_scheduled` - Pickup Scheduled
- `collected` - Collected by Courier
- `in_transit` - In Transit
- `exception` - Shipment Exception
- `on_hold` - On Hold
- `delivered` - Delivered
- `returned_to_sender` - Returned to Sender
- `cancelled` - Cancelled

Air mode statuses:

- `documentation_verified` - Documentation Verified
- `tendered_to_airline` - Tendered to Airline
- `departed_origin_airport` - Departed Origin Airport
- `arrived_at_transit_airport` - Arrived at Transit Airport
- `arrived_at_destination_airport` - Arrived at Destination Airport
- `customs_clearance_in_progress` - Customs Clearance in Progress
- `customs_cleared` - Customs Cleared
- `handed_to_last_mile_courier` - Handed to Last-Mile Courier
- `out_for_delivery` - Out for Delivery

Road mode statuses:

- `route_assigned` - Route Assigned
- `departed_origin_depot` - Departed Origin Depot
- `at_regional_hub` - At Regional Hub
- `at_transit_hub` - At Transit Hub
- `arrived_at_destination_depot` - Arrived at Destination Depot
- `linehaul_in_progress` - Linehaul in Progress
- `out_for_delivery` - Out for Delivery
- `delivery_attempted` - Delivery Attempted

Freight mode statuses:

- `freight_booking_confirmed` - Freight Booking Confirmed
- `cargo_received` - Cargo Received
- `palletized_consolidated` - Palletized / Consolidated
- `loaded_for_dispatch` - Loaded for Dispatch
- `in_linehaul` - In Linehaul
- `at_cross_dock_facility` - At Cross-Dock Facility
- `awaiting_delivery_appointment` - Awaiting Delivery Appointment
- `delivery_appointment_confirmed` - Delivery Appointment Confirmed
- `unloaded_at_destination_facility` - Unloaded at Destination Facility
- `proof_of_delivery_received` - Proof of Delivery Received

Legacy status rows remain supported at the display layer:

- `label_created` renders as `shipment_created`
- `picked_up` renders as `collected`
- `arrived_at_hub` renders as the closest mode-specific hub milestone
- `customs_clearance` renders as `customs_clearance_in_progress`
- `received_at_origin_facility` renders as a mode-specific origin milestone
- `departed_origin_facility` renders as a mode-specific departure milestone
- `arrived_at_destination_facility` renders as a mode-specific destination milestone

The migration `supabase/migrations/007_shipping_transport_modes.sql` adds the
nullable-compatible `transport_mode` defaults, check constraints, and indexes
needed for mode-aware shipment operations.

The migration `supabase/migrations/008_mode_aware_service_types.sql` keeps
`orders.service_type` and `bookings.service_type` compatible with legacy
Express/Economy rows while documenting the new service codes and adding small
transport-mode/service indexes for admin shipment operations.

## Admin Customer Lookup Patch

Admin shipment creation includes a server-side customer lookup workflow. Admins
can search existing customer profiles by full name, phone, or safely available
auth email, select a result, and link the generated booking and order to that
customer user id.

Linked customer behavior:

- Selected customers are written to `bookings.user_id` and `orders.user_id`.
- Sender name, email, and phone are autofilled from the selected customer when
  available, but staff can still edit those fields before creating the shipment.
- If no customer is selected, the shipment remains a supported unassigned/manual
  shipment.
- Admin shipment tables and detail pages show linked customer name, email, and
  phone where available, with clean unassigned states for manual shipments.

This patch ends with lint, production build, commit, and push to GitHub.

## Admin CMS Layout Polish Patch

The admin CMS now uses a focused editing workspace instead of rendering every
editor in one long page. The CMS sidebar selects one active section at a time,
the editor canvas is wider, and major CMS blocks use more generous spacing.

CMS usability improvements:

- `/admin/cms` uses a sidebar plus single active editor layout.
- Homepage content is grouped into collapsible subsections for Hero, Tracking
  Promo, Services Preview, Trust, Coverage, Testimonials, FAQ Preview, CTA, and
  SEO.
- Save controls and publish/draft controls are visually stronger and sticky
  within the active editing area.
- Admin routes suppress the public header, footer CTA, and footer so the CMS
  feels like a back-office interface rather than a public page.

## Routes

Public:

- `/`
- `/track`
- `/quote`
- `/book`
- `/book/success`
- `/book/cancel`
- `/label/[bookingId]`
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
- `/admin/login`
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
- `/admin/shipments/create`
- `/admin/shipments/[id]`
- `/admin/tracking-events`
- `/admin/quotes`
- `/admin/bookings`
- `/admin/users`
- `/admin/cms`
- `/admin/settings`

Developer:

- `/developer/bootstrap-users`

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
