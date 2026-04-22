import type { User } from "@supabase/supabase-js";

import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { CustomerSearchResult } from "@/types/admin";

type CustomerProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
};

function sanitizeSearchTerm(value: string) {
  return value.trim().replaceAll("%", "\\%").replaceAll("_", "\\_");
}

function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function mapCustomer(
  row: CustomerProfileRow,
  emailByUserId: Map<string, string | null>,
): CustomerSearchResult {
  return {
    id: row.id,
    fullName: row.full_name,
    email: emailByUserId.get(row.id) ?? null,
    phone: row.phone,
    role: row.role,
  };
}

async function getAuthEmailsByUserId(userIds: string[]) {
  const uniqueIds = [...new Set(userIds)].filter(Boolean);
  const emailByUserId = new Map<string, string | null>();

  if (uniqueIds.length === 0) {
    return emailByUserId;
  }

  try {
    const serviceRole = createSupabaseServiceRoleClient();
    const authUsers = await Promise.all(
      uniqueIds.map(async (id) => {
        const { data, error } = await serviceRole.auth.admin.getUserById(id);

        if (error || !data.user) {
          return null;
        }

        return data.user;
      }),
    );

    for (const user of authUsers) {
      if (user) {
        emailByUserId.set(user.id, user.email ?? null);
      }
    }
  } catch {
    return emailByUserId;
  }

  return emailByUserId;
}

async function getAuthEmailMatches(query: string, limit: number) {
  try {
    const serviceRole = createSupabaseServiceRoleClient();
    const { data, error } = await serviceRole.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) {
      return [];
    }

    const normalizedQuery = normalizeEmail(query);

    return data.users
      .filter((user: User) =>
        normalizeEmail(user.email).includes(normalizedQuery),
      )
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function searchAdminCustomers(
  query: string,
  limit = 10,
): Promise<CustomerSearchResult[]> {
  const normalizedQuery = sanitizeSearchTerm(query);

  if (normalizedQuery.length < 2) {
    return [];
  }

  const { supabase } = await assertAdminAction();
  const pattern = `%${normalizedQuery}%`;
  const [nameMatches, phoneMatches, authEmailMatches] = await Promise.all([
    supabase
      .from("users")
      .select("id, full_name, phone, role, created_at, updated_at")
      .eq("role", "customer")
      .ilike("full_name", pattern)
      .limit(limit),
    supabase
      .from("users")
      .select("id, full_name, phone, role, created_at, updated_at")
      .eq("role", "customer")
      .ilike("phone", pattern)
      .limit(limit),
    getAuthEmailMatches(normalizedQuery, limit),
  ]);

  const rowsById = new Map<string, CustomerProfileRow>();

  for (const row of (nameMatches.data ?? []) as CustomerProfileRow[]) {
    rowsById.set(row.id, row);
  }

  for (const row of (phoneMatches.data ?? []) as CustomerProfileRow[]) {
    rowsById.set(row.id, row);
  }

  const emailMatchIds = authEmailMatches.map((user) => user.id);

  if (emailMatchIds.length > 0) {
    const { data } = await supabase
      .from("users")
      .select("id, full_name, phone, role, created_at, updated_at")
      .eq("role", "customer")
      .in("id", emailMatchIds);

    for (const row of (data ?? []) as CustomerProfileRow[]) {
      rowsById.set(row.id, row);
    }
  }

  const emailByUserId = await getAuthEmailsByUserId([...rowsById.keys()]);

  for (const user of authEmailMatches) {
    emailByUserId.set(user.id, user.email ?? null);
  }

  return [...rowsById.values()]
    .map((row) => mapCustomer(row, emailByUserId))
    .slice(0, limit);
}

export async function getAdminCustomerById(
  customerId: string,
): Promise<CustomerSearchResult | null> {
  const { supabase } = await assertAdminAction();
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, phone, role, created_at, updated_at")
    .eq("id", customerId)
    .eq("role", "customer")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const emailByUserId = await getAuthEmailsByUserId([customerId]);

  return mapCustomer(data as CustomerProfileRow, emailByUserId);
}

export async function findAdminCustomerByEmail(
  email: string,
): Promise<CustomerSearchResult | null> {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  const matches = await searchAdminCustomers(normalizedEmail, 10);

  return (
    matches.find(
      (customer) => normalizeEmail(customer.email) === normalizedEmail,
    ) ?? null
  );
}
