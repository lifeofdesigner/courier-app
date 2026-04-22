import { cache } from "react";

import { company, socialLinks } from "@/constants/site";
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
};

const fallbackSettings: PublicPageSettings = {
  siteIdentity: {
    siteName: company.name,
    logo: null,
    favicon: null,
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
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
}

function readImage(value: unknown): CmsImage | null {
  if (!isRecord(value)) {
    return null;
  }

  const src = readString(value.src, "");

  if (!src) {
    return null;
  }

  return {
    src,
    alt: readString(value.alt, "Site image"),
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
  }

  return settings;
}

export const getPublicPageSettings = cache(
  async (): Promise<PublicPageSettings> => {
    try {
      const supabase = await createSupabaseServerClient();

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
