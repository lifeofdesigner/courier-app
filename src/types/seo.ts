export interface SeoPageMeta {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string | null;
  noIndex?: boolean;
}

export interface OrganizationJsonLd {
  name: string;
  url: string;
  logo?: string;
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
    areaServed?: string | string[];
    availableLanguage?: string | string[];
  };
}
