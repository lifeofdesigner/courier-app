import type { ServiceType } from "@/types/quote";

export interface AddressInput {
  contactName: string;
  companyName?: string;
  phone?: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  stateRegion?: string;
  postalCode?: string;
  country: string;
}

export interface BookingFormInput {
  quoteId?: string | null;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  serviceType: ServiceType;
  packageType: string;
  weightKg: number;
  declaredValue: number;
  pickupDate: string;
  pickupWindow: string;
  specialInstructions?: string;
  pickup: AddressInput;
  delivery: AddressInput;
}

export interface BookingRecord {
  id: string;
  userId: string | null;
  quoteId: string | null;
  pickupAddressId: string | null;
  deliveryAddressId: string | null;
  senderName: string;
  senderEmail: string;
  senderPhone: string | null;
  recipientName: string;
  recipientEmail: string | null;
  recipientPhone: string | null;
  serviceType: ServiceType;
  packageType: string | null;
  weightKg: number;
  declaredValue: number;
  pickupDate: string;
  pickupWindow: string | null;
  specialInstructions: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}
