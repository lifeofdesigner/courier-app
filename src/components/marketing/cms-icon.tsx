import {
  Plane,
  Building2,
  CheckCircle2,
  Clock3,
  Globe,
  Headphones,
  MapPin,
  PackageCheck,
  Route,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";

import type { CmsIconName } from "@/types/cms";

export type CmsIconProps = {
  name: CmsIconName;
  className?: string;
};

const iconMap = {
  air: Plane,
  building: Building2,
  "check-circle": CheckCircle2,
  clock: Clock3,
  globe: Globe,
  headphones: Headphones,
  "map-pin": MapPin,
  "package-check": PackageCheck,
  route: Route,
  "shield-check": ShieldCheck,
  truck: Truck,
  warehouse: Warehouse,
} satisfies Record<CmsIconName, typeof Building2>;

export function CmsIcon({ name, className }: CmsIconProps) {
  const Icon = iconMap[name];

  return <Icon aria-hidden="true" className={className} />;
}
