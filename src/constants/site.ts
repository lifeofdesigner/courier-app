import type { FooterColumn, NavItem } from "@/types/ui";

export const DEFAULT_SITE_URL = "https://www.example-logistics.com";

export const brandColors = {
  primary: "#FF6B2B",
  navy: "#0B1C3A",
  background: "#F8FAFC",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
} as const;

export const company = {
  name: "Your Logistics Company",
  legalName: "Your Logistics Company LLC",
  tagline: "Courier, cargo, and freight support for business-critical shipments.",
  phone: "+1 (800) 555-0188",
  phoneHref: "tel:+18005550188",
  email: "support@example-logistics.com",
  emailHref: "mailto:support@example-logistics.com",
  address: "1200 Commerce Way, Newark, NJ 07102",
  addressLines: ["1200 Commerce Way", "Newark, NJ 07102", "United States"],
  hours: "Monday-Friday, 8:00 AM-7:00 PM",
  operatingHours: "Monday to Friday, 8:00 AM-7:00 PM",
  coverage: "Local, regional, and nationwide courier coverage",
  trustStatement:
    "Secure handling, clear tracking, and dependable pickup windows for business-critical shipments.",
} as const;

export const siteConfig = {
  name: company.name,
  defaultUrl: DEFAULT_SITE_URL,
  defaultTitle: `${company.name} | Reliable courier and delivery services`,
  titleTemplate: `%s | ${company.name}`,
  description:
    "Professional courier services for same-day pickup, scheduled delivery, shipment tracking, and business courier support.",
  defaultOgImagePath: "/opengraph-image",
  twitterImagePath: "/twitter-image",
  locale: "en_US",
  twitterHandle: "@examplelogistics",
} as const;

export const socialLinks = {
  linkedin: "https://www.linkedin.com/company/example-logistics",
  x: "https://x.com/examplelogistics",
  facebook: "https://www.facebook.com/examplelogistics",
} as const;

export const blogCategoryLabels = {
  operations: "Operations",
  tracking: "Tracking",
  customs: "Customs",
  business: "Business shipping",
  planning: "Shipping planning",
} as const;

export const transportModeLabels = {
  air: "Air",
  road: "Road",
  freight: "Freight",
} as const;

export const modeAwareServiceTypeLabels = {
  express_air: "Express Air",
  standard_air: "Standard Air",
  priority_air_cargo: "Priority Air Cargo",
  same_day_road: "Same-Day Road",
  regional_road: "Regional Road",
  standard_road: "Standard Road",
  ltl_freight: "LTL Freight",
  full_truckload: "Full Truckload",
  pallet_freight: "Pallet Freight",
  consolidated_freight: "Consolidated Freight",
} as const;

export const ctaLabels = {
  track: "Track Shipment",
  quote: "Get a Quote",
  book: "Book Pickup",
  signIn: "Sign in",
  adminSignIn: "Admin sign in",
  myAccount: "My Account",
  admin: "Admin",
  createAccount: "Create account",
  contact: "Contact support",
} as const;

export const publicNavigation: NavItem[] = [
  { label: "Book Pickup", href: "/book" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export const primaryCtas = {
  track: { label: ctaLabels.track, href: "/track" },
  quote: { label: ctaLabels.quote, href: "/quote" },
} as const satisfies Record<string, NavItem>;

export const accountCtas = {
  signedOut: { label: ctaLabels.signIn, href: "/login" },
  customer: { label: ctaLabels.myAccount, href: "/dashboard" },
  admin: { label: ctaLabels.admin, href: "/admin" },
} as const satisfies Record<string, NavItem>;

export const authNavigation: NavItem[] = [
  { label: "Customer Login", href: "/login" },
  { label: ctaLabels.adminSignIn, href: "/admin/login" },
  { label: "Sign Up", href: "/sign-up" },
  { label: "Forgot Password", href: "/forgot-password" },
];

export const customerNavigation: NavItem[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "My Shipments", href: "/dashboard/shipments" },
  { label: "My Quotes", href: "/dashboard/quotes" },
  { label: "Profile & Address Book", href: "/dashboard/profile" },
];

export type AdminModuleKey =
  | "dashboard"
  | "shipments"
  | "customers"
  | "quotes"
  | "bookings"
  | "cms"
  | "analytics"
  | "settings";

export type AdminTopNavigationItem = NavItem & {
  module: AdminModuleKey;
  matchHrefs?: readonly string[];
};

export type AdminSubNavigationItem = NavItem & {
  description?: string;
};

export const adminTopNavigation = [
  { label: "Dashboard", href: "/admin", module: "dashboard" },
  {
    label: "Shipments",
    href: "/admin/shipments",
    module: "shipments",
    matchHrefs: ["/admin/shipments", "/admin/tracking-events"],
  },
  {
    label: "Customers",
    href: "/admin/users",
    module: "customers",
    matchHrefs: ["/admin/users"],
  },
  { label: "Quotes", href: "/admin/quotes", module: "quotes" },
  { label: "Bookings", href: "/admin/bookings", module: "bookings" },
  { label: "CMS", href: "/admin/cms", module: "cms" },
  { label: "Analytics", href: "/admin/analytics", module: "analytics" },
  { label: "Settings", href: "/admin/settings", module: "settings" },
] as const satisfies readonly AdminTopNavigationItem[];

export const adminModuleDetails = {
  dashboard: {
    label: "Dashboard",
    description: "Executive scan of operational activity and admin actions.",
  },
  shipments: {
    label: "Shipments",
    description: "Shipment queues, manual creation, and tracking events.",
  },
  customers: {
    label: "Customers",
    description: "Customer profiles, staff access, and role management.",
  },
  quotes: {
    label: "Quotes",
    description: "Quote demand, customer intent, and follow-up visibility.",
  },
  bookings: {
    label: "Bookings",
    description: "Pickup requests, payment states, and label readiness.",
  },
  cms: {
    label: "CMS",
    description: "Public site content, publishing state, and SEO fields.",
  },
  analytics: {
    label: "Analytics",
    description: "Operational counts from shipment, booking, quote, and user data.",
  },
  settings: {
    label: "Settings",
    description: "Business details, website links, and launch readiness.",
  },
} as const satisfies Record<
  AdminModuleKey,
  { label: string; description: string }
>;

export const adminSubNavigation = {
  dashboard: [
    { label: "Overview", href: "/admin" },
    { label: "Quick Actions", href: "/admin#quick-actions" },
    { label: "Recent Activity", href: "/admin#recent-activity" },
  ],
  shipments: [
    { label: "All Shipments", href: "/admin/shipments" },
    { label: "Create Shipment", href: "/admin/shipments/create" },
    { label: "Tracking Events", href: "/admin/tracking-events" },
  ],
  customers: [
    { label: "All Customers", href: "/admin/users" },
    { label: "Create User", href: "/admin/users/create" },
    { label: "Role Management", href: "/admin/users#roles" },
  ],
  quotes: [
    { label: "All Quotes", href: "/admin/quotes" },
    { label: "Quote Pipeline", href: "/admin/quotes#quote-pipeline" },
  ],
  bookings: [
    { label: "All Bookings", href: "/admin/bookings" },
    { label: "Payment Review", href: "/admin/bookings#payment-review" },
  ],
  cms: [
    { label: "Overview", href: "/admin/cms?section=overview" },
    { label: "Site Identity", href: "/admin/cms?section=site-identity" },
    { label: "Homepage", href: "/admin/cms?section=homepage" },
    { label: "Services", href: "/admin/cms?section=services-page" },
    { label: "About", href: "/admin/cms?section=about-page" },
    { label: "Contact", href: "/admin/cms?section=contact-info" },
    { label: "FAQ", href: "/admin/cms?section=faq" },
    { label: "Footer", href: "/admin/cms?section=footer" },
    { label: "SEO", href: "/admin/cms?section=seo" },
  ],
  analytics: [
    { label: "Overview", href: "/admin/analytics" },
    { label: "Shipment Mix", href: "/admin/analytics#shipment-mix" },
    { label: "Booking Mix", href: "/admin/analytics#booking-mix" },
  ],
  settings: [
    { label: "Overview", href: "/admin/settings" },
    { label: "Business Details", href: "/admin/settings#site-settings" },
    { label: "Launch Readiness", href: "/admin/settings#integrations" },
  ],
} as const satisfies Record<AdminModuleKey, readonly AdminSubNavigationItem[]>;

export const adminNavigation: NavItem[] = adminTopNavigation.map(
  ({ label, href }) => ({ label, href }),
);

export const footerNavigation: FooterColumn[] = [
  {
    title: "Quick Links",
    items: [
      { label: "Track Shipment", href: "/track" },
      { label: "Get Quote", href: "/quote" },
      { label: "Book Pickup", href: "/book" },
      { label: "Customer Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Services",
    items: [
      { label: "Same-day courier", href: "/services" },
      { label: "Scheduled pickup", href: "/services" },
      { label: "Domestic freight", href: "/services" },
      { label: "International courier", href: "/services" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Sign In", href: "/login" },
    ],
  },
];

export const legalNavigation: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export const servicesPreview = [
  {
    title: "Same-day courier",
    description:
      "Priority local delivery for documents, retail orders, and urgent business shipments.",
  },
  {
    title: "Scheduled pickup",
    description:
      "Book recurring or one-time pickups with clear collection windows and reliable handling.",
  },
  {
    title: "Domestic freight",
    description:
      "Move heavier parcels and multi-piece shipments through a managed courier network.",
  },
] as const;

export const trustSignals = [
  "Clear tracking from pickup to delivery",
  "Professional handling for business shipments",
  "Support teams that understand courier operations",
  "Straightforward quotes before you book",
] as const;
