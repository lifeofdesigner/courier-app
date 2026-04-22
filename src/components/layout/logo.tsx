import Link from "next/link";
import Image from "next/image";
import { PackageCheck } from "lucide-react";

import { company } from "@/constants/site";
import { cn } from "@/lib/utils";
import type { CmsImage } from "@/types/cms";

export type LogoProps = {
  variant?: "default" | "inverse";
  siteName?: string;
  logo?: CmsImage | null;
  context?: "header" | "footer";
};

function getBrandText(siteName?: string) {
  const displayName = (siteName || company.name).trim();
  const logisticsMatch = displayName.match(/\s+logistics$/i);

  if (logisticsMatch) {
    return {
      title: displayName.replace(/\s+logistics$/i, ""),
      descriptor: "Logistics",
    };
  }

  return {
    title: displayName,
    descriptor: "Logistics",
  };
}

export function Logo({
  variant = "default",
  siteName,
  logo,
  context = "header",
}: LogoProps) {
  const isInverse = variant === "inverse";
  const { title, descriptor } = getBrandText(siteName);
  const logoWidth = logo?.width ?? 160;
  const logoHeight = logo?.height ?? 80;

  return (
    <Link
      href="/"
      aria-label={`${title} ${descriptor} home`}
      className="inline-flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      {logo ? (
        <span
          className={cn(
            "flex h-14 max-w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white px-2 py-1 shadow-sm",
            isInverse ? "border-white/15" : "border-slate-200",
          )}
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logoWidth}
            height={logoHeight}
            sizes={context === "footer" ? "128px" : "112px"}
            className="h-full w-auto max-w-28 object-contain"
            unoptimized
          />
        </span>
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
          <PackageCheck aria-hidden="true" className="h-5 w-5" />
        </span>
      )}
      <span className="min-w-0 leading-tight">
        <span
          className={cn(
            "block whitespace-nowrap text-lg font-extrabold tracking-tight sm:text-xl",
            isInverse ? "text-white" : "text-navy",
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            "block whitespace-nowrap text-xs font-bold uppercase tracking-wide",
            isInverse ? "text-slate-300" : "text-muted",
          )}
        >
          {descriptor}
        </span>
      </span>
    </Link>
  );
}
