import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import type { SiteSettingRow } from "@/types/admin";

type SettingRow = {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
  updated_by: string | null;
};

function mapSetting(row: SettingRow): SiteSettingRow {
  return {
    id: row.id,
    key: row.key,
    value: row.value,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

export async function getAdminSiteSettings(): Promise<SiteSettingRow[]> {
  const { supabase } = await assertAdminAction();
  const { data } = await supabase
    .from("site_settings")
    .select(
      `
      id,
      key,
      value,
      updated_at,
      updated_by
    `,
    )
    .order("key", { ascending: true });

  return ((data ?? []) as SettingRow[]).map(mapSetting);
}
