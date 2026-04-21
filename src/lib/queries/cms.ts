import { cache } from "react";

import { homepageFallbackContent } from "@/content/homepage-fallback";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mergeHomepageContentRows } from "@/lib/transformers/cms";
import type {
  CmsContentRow,
  HomePageContent,
  HomepageContentKey,
} from "@/types/cms";

export const HOMEPAGE_CMS_SECTION = "homepage";

export const HOMEPAGE_CONTENT_KEYS = [
  "hero",
  "trackingPromo",
  "services",
  "trust",
  "coverage",
  "testimonials",
  "faqPreview",
  "cta",
  "seo",
] as const satisfies readonly HomepageContentKey[];

// CMS table assumption for Phase 3:
// cms_content rows are published section records shaped as:
// { section: "homepage", key: HomepageContentKey, value: JSON, published: boolean, updated_at: timestamptz }.
// Each value is the full JSON payload for that homepage section.
export const getHomePageContent = cache(async (): Promise<HomePageContent> => {
  try {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return homepageFallbackContent;
    }

    const { data, error } = await supabase
      .from("cms_content")
      .select("section,key,value,published,updated_at")
      .eq("section", HOMEPAGE_CMS_SECTION)
      .eq("published", true)
      .in("key", [...HOMEPAGE_CONTENT_KEYS])
      .order("updated_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return homepageFallbackContent;
    }

    const rows: CmsContentRow[] = data.map((row) => ({
      section: String(row.section),
      key: String(row.key),
      value: row.value,
      published: Boolean(row.published),
      updated_at: typeof row.updated_at === "string" ? row.updated_at : null,
    }));

    return mergeHomepageContentRows(rows, homepageFallbackContent);
  } catch {
    return homepageFallbackContent;
  }
});
