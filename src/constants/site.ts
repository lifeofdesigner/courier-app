import type { FooterColumn, NavItem } from "@/types/ui";

export const DEFAULT_SITE_URL = "https://www.atlascourier.com";

export const brandColors = {
  primary: "#FF6B2B",
  navy: "#0B1C3A",
  background: "#F8FAFC",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
} as const;

export const company = {
  name: "Atlas Courier",
  legalName: "Atlas Courier Logistics",
  tagline: "Reliable courier services for business-critical deliveries.",
  phone: "+1 (800) 555-0188",
  phoneHref: "tel:+18005550188",
  email: "support@atlascourier.com",
  emailHref: "mailto:support@atlascourier.com",
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
  twitterHandle: "@atlascourier",
} as const;

export const socialLinks = {
  linkedin: "https://www.linkedin.com/company/atlas-courier",
  x: "https://x.com/atlascourier",
  facebook: "https://www.facebook.com/atlascourier",
} as const;

export const blogCategoryLabels = {
  operations: "Operations",
  tracking: "Tracking",
  customs: "Customs",
  business: "Business shipping",
  planning: "Shipping planning",
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

export const adminNavigation: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Shipments", href: "/admin/shipments" },
  { label: "Create Shipment", href: "/admin/shipments/create" },
  { label: "Tracking Events", href: "/admin/tracking-events" },
  { label: "Quotes", href: "/admin/quotes" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Users", href: "/admin/users" },
  { label: "Create User", href: "/admin/users/create" },
  { label: "CMS", href: "/admin/cms" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Settings", href: "/admin/settings" },
];

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
