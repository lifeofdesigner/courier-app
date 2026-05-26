import { cache } from "react";

import { brandColors, company, socialLinks } from "@/constants/site";
import { applySiteNameTemplate } from "@/lib/brand-template";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CmsImage } from "@/types/cms";

type SiteSettingQueryRow = {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
  updated_by: string | null;
};

export type PublicPageSettings = {
  siteIdentity: {
    siteName: string;
    logo: CmsImage | null;
    favicon: CmsImage | null;
    updatedAt: string | null;
  };
  companyContact: {
    phone: string;
    email: string;
    address: string;
  };
  supportHours: {
    label: string;
  };
  socialLinks: {
    linkedin: string;
    x: string;
    facebook: string;
  };
  footerNotice: {
    text: string;
  };
  themeColors: {
    primary: string;
    navy: string;
    background: string;
    text: string;
    muted: string;
    border: string;
  };
};

const fallbackSettings: PublicPageSettings = {
  siteIdentity: {
    siteName: company.name,
    logo: null,
    favicon: null,
    updatedAt: null,
  },
  companyContact: {
    phone: company.phone,
    email: company.email,
    address: company.address,
  },
  supportHours: {
    label: company.operatingHours,
  },
  socialLinks,
  footerNotice: {
    text: company.trustStatement,
  },
  themeColors: {
    primary: brandColors.primary,
    navy: brandColors.navy,
    background: brandColors.background,
    text: brandColors.text,
    muted: brandColors.muted,
    border: brandColors.border,
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
}

function readHexColor(value: unknown, fallback: string) {
  const color = typeof value === "string" ? value.trim() : "";

  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}

function readImage(value: unknown): CmsImage | null {
  if (!isRecord(value)) {
    return null;
  }

  const src = readString(value.src, "");
  const width = Number(value.width);
  const height = Number(value.height);

  if (!src) {
    return null;
  }

  return {
    src,
    alt: readString(value.alt, "Site image"),
    ...(Number.isFinite(width) && width > 0 ? { width } : {}),
    ...(Number.isFinite(height) && height > 0 ? { height } : {}),
  };
}

function mergeSettings(rows: SiteSettingQueryRow[]): PublicPageSettings {
  const settings = structuredClone(fallbackSettings);

  for (const row of rows) {
    if (!isRecord(row.value)) {
      continue;
    }

    if (row.key === "company_contact") {
      settings.companyContact.phone = readString(
        row.value.phone,
        settings.companyContact.phone,
      );
      settings.companyContact.email = readString(
        row.value.email,
        settings.companyContact.email,
      );
      settings.companyContact.address = readString(
        row.value.address,
        settings.companyContact.address,
      );
    }

    if (row.key === "site_identity") {
      settings.siteIdentity.siteName = readString(
        row.value.siteName,
        settings.siteIdentity.siteName,
      );
      settings.siteIdentity.logo = readImage(row.value.logo);
      settings.siteIdentity.favicon = readImage(row.value.favicon);
      settings.siteIdentity.updatedAt = row.updated_at;
    }

    if (row.key === "support_hours") {
      settings.supportHours.label = readString(
        row.value.label,
        settings.supportHours.label,
      );
    }

    if (row.key === "social_links") {
      settings.socialLinks.linkedin = readString(
        row.value.linkedin,
        settings.socialLinks.linkedin,
      );
      settings.socialLinks.x = readString(row.value.x, settings.socialLinks.x);
      settings.socialLinks.facebook = readString(
        row.value.facebook,
        settings.socialLinks.facebook,
      );
    }

    if (row.key === "footer_notice") {
      settings.footerNotice.text = readString(
        row.value.text,
        settings.footerNotice.text,
      );
    }

    if (row.key === "theme_colors") {
      settings.themeColors.primary = readHexColor(
        row.value.primary,
        settings.themeColors.primary,
      );
      settings.themeColors.navy = readHexColor(
        row.value.navy,
        settings.themeColors.navy,
      );
      settings.themeColors.background = readHexColor(
        row.value.background,
        settings.themeColors.background,
      );
      settings.themeColors.text = readHexColor(
        row.value.text,
        settings.themeColors.text,
      );
      settings.themeColors.muted = readHexColor(
        row.value.muted,
        settings.themeColors.muted,
      );
      settings.themeColors.border = readHexColor(
        row.value.border,
        settings.themeColors.border,
      );
    }
  }

  return applySiteNameTemplate(settings, settings.siteIdentity.siteName);
}

export const getPublicPageSettings = cache(
  async (): Promise<PublicPageSettings> => {
    try {
      let supabase;

      try {
        supabase = createSupabaseServiceRoleClient();
      } catch {
        supabase = await createSupabaseServerClient();
      }

      if (!supabase) {
        return fallbackSettings;
      }

      const { data, error } = await supabase
        .from("site_settings")
        .select("id, key, value, updated_at, updated_by")
        .in("key", [
          "company_contact",
          "site_identity",
          "support_hours",
          "social_links",
          "footer_notice",
          "theme_colors",
        ]);

      if (error || !data) {
        return fallbackSettings;
      }

      return mergeSettings(data as SiteSettingQueryRow[]);
    } catch {
      return fallbackSettings;
    }
  },
);
