import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AddressFormInput, SavedAddressRecord } from "@/types/address";
import type { AppUserProfile } from "@/types/auth";

type AddressRow = {
  id: string;
  label: string | null;
  contact_name: string;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  line_1: string;
  line_2: string | null;
  city: string;
  state_region: string | null;
  postal_code: string | null;
  country: string;
  address_type: string;
  created_at: string;
  updated_at: string;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
};

function optionalValue(value: string | undefined) {
  const normalized = value?.trim();

  return normalized && normalized.length > 0 ? normalized : null;
}

function mapAddress(row: AddressRow): SavedAddressRecord {
  return {
    id: row.id,
    label: row.label,
    contactName: row.contact_name,
    companyName: row.company_name,
    phone: row.phone,
    email: row.email,
    line1: row.line_1,
    line2: row.line_2,
    city: row.city,
    stateRegion: row.state_region,
    postalCode: row.postal_code,
    country: row.country,
    addressType: row.address_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProfile(row: ProfileRow): AppUserProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getSavedAddresses(): Promise<SavedAddressRecord[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from("addresses")
    .select(
      `
      id,
      label,
      contact_name,
      company_name,
      phone,
      email,
      line_1,
      line_2,
      city,
      state_region,
      postal_code,
      country,
      address_type,
      created_at,
      updated_at
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return ((data ?? []) as AddressRow[]).map(mapAddress);
}

export async function updateCurrentUserProfile(input: {
  fullName: string;
  phone?: string;
}): Promise<AppUserProfile> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to update your profile.");
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      full_name: input.fullName,
      phone: optionalValue(input.phone),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error || !data) {
    throw new Error("Your profile could not be updated.");
  }

  return mapProfile(data as ProfileRow);
}

export async function createSavedAddress(
  input: AddressFormInput,
): Promise<SavedAddressRecord> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to save an address.");
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: user.id,
      label: optionalValue(input.label),
      contact_name: input.contactName,
      company_name: optionalValue(input.companyName),
      phone: optionalValue(input.phone),
      email: optionalValue(input.email),
      line_1: input.line1,
      line_2: optionalValue(input.line2),
      city: input.city,
      state_region: optionalValue(input.stateRegion),
      postal_code: optionalValue(input.postalCode),
      country: input.country,
      address_type: "saved",
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error("The address could not be saved.");
  }

  return mapAddress(data as AddressRow);
}
