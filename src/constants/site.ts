import type { FooterColumn, NavItem } from "@/types/ui";

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
  hours: "Monday-Friday, 8:00 AM-7:00 PM",
  coverage: "Local, regional, and nationwide courier coverage",
  trustStatement:
    "Secure handling, clear tracking, and dependable pickup windows for business-critical shipments.",
} as const;

export const ctaLabels = {
  track: "Track Shipment",
  quote: "Get a Quote",
  book: "Book Pickup",
  signIn: "Sign in",
  createAccount: "Create account",
  contact: "Contact support",
} as const;

export const publicNavigation: NavItem[] = [
  { label: "Book Pickup", href: "/book" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export const primaryCtas = {
  track: { label: ctaLabels.track, href: "/track" },
  quote: { label: ctaLabels.quote, href: "/quote" },
} as const satisfies Record<string, NavItem>;

export const authNavigation: NavItem[] = [
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/sign-up" },
  { label: "Forgot Password", href: "/forgot-password" },
];

export const customerNavigation: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Shipments", href: "/dashboard/shipments" },
  { label: "My Quotes", href: "/dashboard/quotes" },
  { label: "Profile", href: "/dashboard/profile" },
];

export const adminNavigation: NavItem[] = [
  { label: "Admin Dashboard", href: "/admin" },
  { label: "Manage Shipments", href: "/admin/shipments" },
  { label: "Tracking Events", href: "/admin/tracking-events" },
  { label: "Manage Quotes", href: "/admin/quotes" },
  { label: "Manage Bookings", href: "/admin/bookings" },
  { label: "Manage Users", href: "/admin/users" },
  { label: "CMS", href: "/admin/cms" },
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
