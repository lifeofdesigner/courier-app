import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  PricingRuleRecord,
  QuoteBreakdown,
  QuoteFormInput,
  QuoteRecord,
  QuoteZone,
  ServiceType,
} from "@/types/quote";

type PricingRuleRow = {
  id: string;
  name: string;
  service_type: string;
  zone: string;
  min_weight_kg: number | string;
  max_weight_kg: number | string | null;
  base_price: number | string;
  per_kg_price: number | string;
  fuel_surcharge_rate: number | string;
  remote_area_flat: number | string;
  is_active: boolean;
  priority: number;
};

type QuoteRow = {
  id: string;
  user_id: string | null;
  full_name: string | null;
  email: string | null;
  origin_country: string;
  origin_city: string;
  destination_country: string;
  destination_city: string;
  service_type: string;
  package_type: string | null;
  weight_kg: number | string;
  declared_value: number | string;
  currency: string;
  subtotal: number | string;
  fuel_surcharge: number | string;
  remote_area_surcharge: number | string;
  total: number | string;
  status: string;
  created_at: string;
};

function toServiceType(value: string): ServiceType {
  return value === "Economy" ? "Economy" : "Express";
}

function toQuoteZone(value: string): QuoteZone {
  return value === "EU" ? "EU" : "International";
}

function mapPricingRule(row: PricingRuleRow): PricingRuleRecord {
  return {
    id: row.id,
    name: row.name,
    serviceType: toServiceType(row.service_type),
    zone: toQuoteZone(row.zone),
    minWeightKg: Number(row.min_weight_kg),
    maxWeightKg:
      row.max_weight_kg === null ? null : Number(row.max_weight_kg),
    basePrice: Number(row.base_price),
    perKgPrice: Number(row.per_kg_price),
    fuelSurchargeRate: Number(row.fuel_surcharge_rate),
    remoteAreaFlat: Number(row.remote_area_flat),
    isActive: row.is_active,
    priority: row.priority,
  };
}

function mapQuote(row: QuoteRow): QuoteRecord {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
    originCountry: row.origin_country,
    originCity: row.origin_city,
    destinationCountry: row.destination_country,
    destinationCity: row.destination_city,
    serviceType: toServiceType(row.service_type),
    packageType: row.package_type,
    weightKg: Number(row.weight_kg),
    declaredValue: Number(row.declared_value),
    currency: "EUR",
    subtotal: Number(row.subtotal),
    fuelSurcharge: Number(row.fuel_surcharge),
    remoteAreaSurcharge: Number(row.remote_area_surcharge),
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getPricingRules(input: {
  serviceType: ServiceType;
}): Promise<PricingRuleRecord[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("pricing_rules")
    .select(
      `
      id,
      name,
      service_type,
      zone,
      min_weight_kg,
      max_weight_kg,
      base_price,
      per_kg_price,
      fuel_surcharge_rate,
      remote_area_flat,
      is_active,
      priority
    `,
    )
    .eq("is_active", true)
    .eq("service_type", input.serviceType)
    .order("priority", { ascending: true });

  if (error) {
    throw new Error("Pricing rules are unavailable.");
  }

  return ((data ?? []) as PricingRuleRow[]).map(mapPricingRule);
}

export async function insertQuoteRecord({
  input,
  breakdown,
  userId,
}: {
  input: QuoteFormInput;
  breakdown: QuoteBreakdown;
  userId: string | null;
}): Promise<QuoteRecord> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("quotes")
    .insert({
      user_id: userId,
      full_name: input.fullName,
      email: input.email,
      origin_country: input.originCountry,
      origin_city: input.originCity,
      destination_country: input.destinationCountry,
      destination_city: input.destinationCity,
      service_type: input.serviceType,
      package_type: input.packageType,
      weight_kg: input.weightKg,
      declared_value: input.declaredValue,
      currency: "EUR",
      subtotal: breakdown.subtotal,
      fuel_surcharge: breakdown.fuelSurcharge,
      remote_area_surcharge: breakdown.remoteAreaSurcharge,
      total: breakdown.total,
      status: "calculated",
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error("The quote could not be saved.");
  }

  return mapQuote(data as QuoteRow);
}
