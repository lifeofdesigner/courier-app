export type ServiceType = "Express" | "Economy";

export type QuoteZone = "EU" | "International";

export interface QuoteFormInput {
  fullName: string;
  email: string;
  originCountry: string;
  originCity: string;
  destinationCountry: string;
  destinationCity: string;
  serviceType: ServiceType;
  packageType: string;
  weightKg: number;
  declaredValue: number;
}

export interface PricingRuleRecord {
  id: string;
  name: string;
  serviceType: ServiceType;
  zone: QuoteZone;
  minWeightKg: number;
  maxWeightKg: number | null;
  basePrice: number;
  perKgPrice: number;
  fuelSurchargeRate: number;
  remoteAreaFlat: number;
  isActive: boolean;
  priority: number;
}

export interface QuoteBreakdown {
  zone: QuoteZone;
  subtotal: number;
  fuelSurcharge: number;
  remoteAreaSurcharge: number;
  total: number;
  currency: "EUR";
  matchedRuleName: string;
}

export interface QuoteRecord {
  id: string;
  userId: string | null;
  fullName: string | null;
  email: string | null;
  originCountry: string;
  originCity: string;
  destinationCountry: string;
  destinationCity: string;
  serviceType: ServiceType;
  packageType: string | null;
  weightKg: number;
  declaredValue: number;
  currency: "EUR";
  subtotal: number;
  fuelSurcharge: number;
  remoteAreaSurcharge: number;
  total: number;
  status: string;
  createdAt: string;
}
