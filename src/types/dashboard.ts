import type { AppUserProfile } from "@/types/auth";
import type { ShipmentStatus } from "@/types/shipment";

export interface DashboardStats {
  totalShipments: number;
  activeShipments: number;
  totalQuotes: number;
  totalBookings: number;
}

export interface DashboardOverviewData {
  profile: AppUserProfile | null;
  stats: DashboardStats;
  recentShipments: ShipmentTableItem[];
  recentQuotes: QuoteTableItem[];
  recentBookings: BookingListItem[];
}

export interface ShipmentTableItem {
  id: string;
  trackingNumber: string;
  serviceType: string;
  status: ShipmentStatus;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  estimatedDeliveryDate: string | null;
  createdAt: string;
}

export interface QuoteTableItem {
  id: string;
  serviceType: string;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface BookingListItem {
  id: string;
  serviceType: string;
  status: string;
  pickupDate: string;
  createdAt: string;
}
