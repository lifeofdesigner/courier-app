import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import type { AdminCmsRow } from "@/types/admin";

type CmsRow = {
  id: string;
  section: string;
  key: string;
  value: unknown;
  published: boolean;
  updated_at: string;
  updated_by: string | null;
};

function mapCmsRow(row: CmsRow): AdminCmsRow {
  return {
    id: row.id,
    section: row.section,
    key: row.key,
    value: row.value,
    published: row.published,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

export async function getAdminCmsRows(): Promise<AdminCmsRow[]> {
  const { supabase } = await assertAdminAction();
  const { data } = await supabase
    .from("cms_content")
    .select(
      `
      id,
      section,
      key,
      value,
      published,
      updated_at,
      updated_by
    `,
    )
    .order("section", { ascending: true })
    .order("key", { ascending: true });

  return ((data ?? []) as CmsRow[]).map(mapCmsRow);
}
