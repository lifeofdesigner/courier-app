import type { PaymentStatus } from "@/types/payment";

export interface AdminActionState {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
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
  serviceType: string;
  status: string;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  estimatedDeliveryDate: string | null;
  labelUrl: string | null;
  createdAt: string;
  userId: string | null;
}

export interface AdminTrackingEventRow {
  id: string;
  orderId: string;
  status: string;
  label: string;
  description: string | null;
  locationName: string | null;
  eventTime: string;
  createdAt: string;
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
