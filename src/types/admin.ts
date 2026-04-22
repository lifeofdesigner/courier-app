import type { PaymentStatus } from "@/types/payment";
import type {
  ModeAwareServiceType,
  ShipmentStatus,
  TransportMode,
} from "@/types/shipment";
import type {
  AboutPageContent,
  ContactInfoContent,
  CTASectionContent,
  FAQPageContent,
  FooterContent,
  HeroSectionContent,
  ServicePreviewSectionContent,
  ServicesPageContent,
  SiteIdentityContent,
  SocialProofContent,
  TrackingPromoContent,
  TrustSectionContent,
  CoverageBlurb,
  FAQPreviewSectionContent,
  SEOContent,
} from "@/types/cms";

export interface AdminActionState {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  createdShipmentId?: string;
  createdTrackingNumber?: string;
  createdBookingId?: string;
}

export interface CustomerSearchResult {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  role: "customer" | "admin";
}

export interface CustomerSearchActionState {
  success: boolean;
  message: string;
  results: CustomerSearchResult[];
}

export interface CreateShipmentCustomerFormState {
  selectedCustomerId: string;
  selectedCustomerLabel: string;
  selectedCustomerEmail: string;
  selectedCustomerPhone: string;
}

export interface CreateUserActionState {
  success: boolean;
  message: string;
  createdUserId?: string;
  createdEmail?: string;
  createdRole?: "customer" | "admin";
  fieldErrors?: Record<string, string[]>;
}

export interface AdminDashboardStats {
  totalShipments: number;
  activeShipments: number;
  totalQuotes: number;
  totalBookings: number;
  totalUsers: number;
  totalAdmins: number;
}

export interface AdminShipmentRow {
  id: string;
  bookingId: string | null;
  trackingNumber: string;
  referenceCode: string | null;
  customerLabel: string;
  customerEmail: string | null;
  customerPhone: string | null;
  customerUserId: string | null;
  customerIsUnassigned: boolean;
  senderName: string | null;
  senderEmail: string | null;
  recipientName: string;
  recipientEmail: string | null;
  serviceType: ModeAwareServiceType;
  packageType: string | null;
  transportMode: TransportMode;
  status: ShipmentStatus;
  paymentStatus: PaymentStatus;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  weightKg: number;
  declaredValue: number;
  currency: string;
  estimatedDeliveryDate: string | null;
  labelUrl: string | null;
  labelGeneratedAt: string | null;
  createdAt: string;
  userId: string | null;
}

export interface AdminTrackingEventRow {
  id: string;
  orderId: string;
  trackingNumber: string | null;
  status: ShipmentStatus;
  transportMode: TransportMode;
  label: string;
  description: string | null;
  locationName: string | null;
  eventTime: string;
  createdAt: string;
}

export interface AdminShipmentAddressBlock {
  id: string | null;
  contactName: string | null;
  companyName: string | null;
  phone: string | null;
  email: string | null;
  line1: string | null;
  line2: string | null;
  city: string;
  stateRegion: string | null;
  postalCode: string | null;
  country: string;
}

export interface AdminShipmentPaymentSummary {
  bookingId: string | null;
  paymentStatus: PaymentStatus;
  amountDue: number;
  amountPaid: number;
  currency: string;
  paymentProvider: string | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
}

export interface AdminShipmentBookingSummary {
  id: string;
  status: string;
  pickupDate: string;
  pickupWindow: string | null;
  specialInstructions: string | null;
  senderEmail: string;
  senderPhone: string | null;
  recipientEmail: string | null;
  recipientPhone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminShipmentCustomerSummary {
  id: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  isUnassigned: boolean;
}

export interface AdminShipmentDetail {
  id: string;
  bookingId: string | null;
  trackingNumber: string;
  referenceCode: string | null;
  serviceType: ModeAwareServiceType;
  packageType: string | null;
  transportMode: TransportMode;
  status: ShipmentStatus;
  paymentStatus: PaymentStatus;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  senderName: string | null;
  senderEmail: string | null;
  senderPhone: string | null;
  recipientName: string;
  recipientEmail: string | null;
  recipientPhone: string | null;
  weightKg: number;
  declaredValue: number;
  currency: string;
  labelUrl: string | null;
  labelGeneratedAt: string | null;
  estimatedDeliveryDate: string | null;
  createdAt: string;
  updatedAt: string;
  customer: AdminShipmentCustomerSummary;
  booking: AdminShipmentBookingSummary | null;
  payment: AdminShipmentPaymentSummary;
  pickupAddress: AdminShipmentAddressBlock | null;
  deliveryAddress: AdminShipmentAddressBlock | null;
  trackingEvents: AdminTrackingEventRow[];
}

export interface AdminQuoteRow {
  id: string;
  userId: string | null;
  fullName: string | null;
  email: string | null;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  serviceType: string;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface AdminBookingRow {
  id: string;
  userId: string | null;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  serviceType: string;
  status: string;
  paymentStatus: PaymentStatus;
  amountDue: number;
  amountPaid: number;
  currency: string;
  stripeCheckoutSessionId: string | null;
  pickupDate: string;
  createdAt: string;
}

export interface AdminUserRow {
  id: string;
  fullName: string | null;
  phone: string | null;
  role: "customer" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface AdminCmsRow {
  id: string;
  section: string;
  key: string;
  value: unknown;
  published: boolean;
  updatedAt: string;
  updatedBy: string | null;
}

export interface AdminCmsEditorSection<T> {
  id: string | null;
  section: string;
  key: string;
  value: T;
  published: boolean;
  updatedAt: string | null;
}

export interface AdminHomepageCmsSections {
  hero: AdminCmsEditorSection<HeroSectionContent>;
  trackingPromo: AdminCmsEditorSection<TrackingPromoContent>;
  services: AdminCmsEditorSection<ServicePreviewSectionContent>;
  trust: AdminCmsEditorSection<TrustSectionContent>;
  coverage: AdminCmsEditorSection<CoverageBlurb>;
  testimonials: AdminCmsEditorSection<SocialProofContent>;
  faqPreview: AdminCmsEditorSection<FAQPreviewSectionContent>;
  cta: AdminCmsEditorSection<CTASectionContent>;
  seo: AdminCmsEditorSection<SEOContent>;
}

export interface AdminCmsEditorData {
  rows: AdminCmsRow[];
  siteIdentity: AdminCmsEditorSection<SiteIdentityContent>;
  homepage: AdminHomepageCmsSections;
  servicesPage: AdminCmsEditorSection<ServicesPageContent>;
  aboutPage: AdminCmsEditorSection<AboutPageContent>;
  contactInfo: AdminCmsEditorSection<ContactInfoContent>;
  faqPage: AdminCmsEditorSection<FAQPageContent>;
  footer: AdminCmsEditorSection<FooterContent>;
}

export interface SiteSettingRow {
  id: string;
  key: string;
  value: unknown;
  updatedAt: string;
  updatedBy: string | null;
}

export interface AdminOverviewData {
  stats: AdminDashboardStats;
  shipments: AdminShipmentRow[];
  bookings: AdminBookingRow[];
  quotes: AdminQuoteRow[];
  trackingEvents: AdminTrackingEventRow[];
}

export interface AdminAnalyticsData {
  shipmentsByStatus: Record<string, number>;
  quotesByServiceType: Record<string, number>;
  bookingsByStatus: Record<string, number>;
  usersLast7Days: number;
  usersLast30Days: number;
}
