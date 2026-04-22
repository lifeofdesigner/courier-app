export const transportModeDefinitions = [
  {
    code: "air",
    label: "Air",
    description: "Airport, airline, customs, and last-mile courier handling.",
  },
  {
    code: "road",
    label: "Road",
    description: "Depot, hub, linehaul, and courier delivery movements.",
  },
  {
    code: "freight",
    label: "Freight",
    description: "Cargo, pallet, cross-dock, appointment, and POD handling.",
  },
] as const;

export type TransportMode = (typeof transportModeDefinitions)[number]["code"];

export type PricingServiceTier = "Express" | "Economy";

export type ModeAwareServiceDefinition = {
  code: string;
  label: string;
  description: string;
  transportMode: TransportMode;
  pricingTier: PricingServiceTier;
  estimatedTransitDays: number;
};

export const modeAwareServiceDefinitions = {
  air: [
    {
      code: "express_air",
      label: "Express Air",
      description:
        "Fast airport-to-airport movement for time-sensitive shipments.",
      transportMode: "air",
      pricingTier: "Express",
      estimatedTransitDays: 2,
    },
    {
      code: "standard_air",
      label: "Standard Air",
      description: "Balanced air service for planned parcel and cargo moves.",
      transportMode: "air",
      pricingTier: "Economy",
      estimatedTransitDays: 4,
    },
    {
      code: "priority_air_cargo",
      label: "Priority Air Cargo",
      description: "Priority handling for commercial air cargo shipments.",
      transportMode: "air",
      pricingTier: "Express",
      estimatedTransitDays: 1,
    },
  ],
  road: [
    {
      code: "same_day_road",
      label: "Same-Day Road",
      description: "Direct road courier service for urgent local movements.",
      transportMode: "road",
      pricingTier: "Express",
      estimatedTransitDays: 1,
    },
    {
      code: "regional_road",
      label: "Regional Road",
      description: "Regional courier service through road depots and hubs.",
      transportMode: "road",
      pricingTier: "Economy",
      estimatedTransitDays: 2,
    },
    {
      code: "standard_road",
      label: "Standard Road",
      description: "Standard road network service for routine shipments.",
      transportMode: "road",
      pricingTier: "Economy",
      estimatedTransitDays: 4,
    },
  ],
  freight: [
    {
      code: "ltl_freight",
      label: "LTL Freight",
      description: "Less-than-truckload freight for shared linehaul moves.",
      transportMode: "freight",
      pricingTier: "Economy",
      estimatedTransitDays: 5,
    },
    {
      code: "full_truckload",
      label: "Full Truckload",
      description: "Dedicated truckload movement for larger freight.",
      transportMode: "freight",
      pricingTier: "Express",
      estimatedTransitDays: 3,
    },
    {
      code: "pallet_freight",
      label: "Pallet Freight",
      description: "Freight handling for palletized shipments.",
      transportMode: "freight",
      pricingTier: "Economy",
      estimatedTransitDays: 5,
    },
    {
      code: "consolidated_freight",
      label: "Consolidated Freight",
      description: "Consolidated freight service for cost-efficient moves.",
      transportMode: "freight",
      pricingTier: "Economy",
      estimatedTransitDays: 7,
    },
  ],
} as const satisfies Record<
  TransportMode,
  readonly ModeAwareServiceDefinition[]
>;

export const allModeAwareServiceDefinitions = [
  ...modeAwareServiceDefinitions.air,
  ...modeAwareServiceDefinitions.road,
  ...modeAwareServiceDefinitions.freight,
] as const;

export type ModeAwareServiceType =
  (typeof allModeAwareServiceDefinitions)[number]["code"];

export type LegacyServiceType = PricingServiceTier;

export type ShipmentServiceTypeInput =
  | ModeAwareServiceType
  | LegacyServiceType
  | string;

export type ModeAwareServiceMeta = {
  code: ModeAwareServiceType;
  label: string;
  description: string;
  transportMode: TransportMode;
  pricingTier: PricingServiceTier;
  estimatedTransitDays: number;
  isLegacy: boolean;
  originalCode: string;
};

export const modeAwareServiceTypes = Array.from(
  new Set(allModeAwareServiceDefinitions.map((service) => service.code)),
) as [ModeAwareServiceType, ...ModeAwareServiceType[]];

export type ShipmentStatusDefinition = {
  code: string;
  label: string;
  description: string;
  badgeClassName: string;
};

export const commonShipmentStatusDefinitions = [
  {
    code: "shipment_created",
    label: "Shipment Created",
    description:
      "The shipment record has been created and is ready for operational handling.",
    badgeClassName: "bg-slate-100 text-slate-700",
  },
  {
    code: "booking_confirmed",
    label: "Booking Confirmed",
    description: "The booking has been confirmed for operations.",
    badgeClassName: "bg-sky-100 text-sky-700",
  },
  {
    code: "pickup_scheduled",
    label: "Pickup Scheduled",
    description: "A pickup has been scheduled for the shipment.",
    badgeClassName: "bg-sky-100 text-sky-700",
  },
  {
    code: "collected",
    label: "Collected by Courier",
    description: "The shipment has been collected by a courier.",
    badgeClassName: "bg-orange-100 text-orange-700",
  },
  {
    code: "in_transit",
    label: "In Transit",
    description: "The shipment is moving through the logistics network.",
    badgeClassName: "bg-blue-100 text-blue-700",
  },
  {
    code: "exception",
    label: "Shipment Exception",
    description: "The shipment needs attention because an exception occurred.",
    badgeClassName: "bg-rose-100 text-rose-700",
  },
  {
    code: "on_hold",
    label: "On Hold",
    description: "The shipment is temporarily on hold.",
    badgeClassName: "bg-yellow-100 text-yellow-800",
  },
  {
    code: "delivered",
    label: "Delivered",
    description: "The shipment has been delivered successfully.",
    badgeClassName: "bg-emerald-100 text-emerald-700",
  },
  {
    code: "returned_to_sender",
    label: "Returned to Sender",
    description: "The shipment is being returned to the sender.",
    badgeClassName: "bg-fuchsia-100 text-fuchsia-700",
  },
  {
    code: "cancelled",
    label: "Cancelled",
    description: "The shipment has been cancelled.",
    badgeClassName: "bg-zinc-200 text-zinc-700",
  },
] as const satisfies readonly ShipmentStatusDefinition[];

export const modeShipmentStatusDefinitions = {
  air: [
    {
      code: "documentation_verified",
      label: "Documentation Verified",
      description: "Airwaybill, invoice, and shipment paperwork are verified.",
      badgeClassName: "bg-sky-100 text-sky-700",
    },
    {
      code: "tendered_to_airline",
      label: "Tendered to Airline",
      description: "The shipment has been handed over to the airline.",
      badgeClassName: "bg-cyan-100 text-cyan-700",
    },
    {
      code: "departed_origin_airport",
      label: "Departed Origin Airport",
      description: "The shipment has departed the origin airport.",
      badgeClassName: "bg-blue-100 text-blue-700",
    },
    {
      code: "arrived_at_transit_airport",
      label: "Arrived at Transit Airport",
      description: "The shipment has arrived at a transit airport.",
      badgeClassName: "bg-indigo-100 text-indigo-700",
    },
    {
      code: "arrived_at_destination_airport",
      label: "Arrived at Destination Airport",
      description: "The shipment has arrived at the destination airport.",
      badgeClassName: "bg-indigo-100 text-indigo-700",
    },
    {
      code: "customs_clearance_in_progress",
      label: "Customs Clearance in Progress",
      description: "The shipment is being processed by customs.",
      badgeClassName: "bg-violet-100 text-violet-700",
    },
    {
      code: "customs_cleared",
      label: "Customs Cleared",
      description: "Customs clearance is complete.",
      badgeClassName: "bg-emerald-50 text-emerald-700",
    },
    {
      code: "handed_to_last_mile_courier",
      label: "Handed to Last-Mile Courier",
      description: "The shipment has been handed to the final delivery courier.",
      badgeClassName: "bg-orange-100 text-orange-700",
    },
    {
      code: "out_for_delivery",
      label: "Out for Delivery",
      description: "The shipment is with the courier for final delivery.",
      badgeClassName: "bg-amber-100 text-amber-700",
    },
  ],
  road: [
    {
      code: "route_assigned",
      label: "Route Assigned",
      description: "The shipment has been assigned to a road route.",
      badgeClassName: "bg-sky-100 text-sky-700",
    },
    {
      code: "departed_origin_depot",
      label: "Departed Origin Depot",
      description: "The shipment has left the origin depot.",
      badgeClassName: "bg-blue-100 text-blue-700",
    },
    {
      code: "at_regional_hub",
      label: "At Regional Hub",
      description: "The shipment is being processed at a regional hub.",
      badgeClassName: "bg-cyan-100 text-cyan-700",
    },
    {
      code: "at_transit_hub",
      label: "At Transit Hub",
      description: "The shipment is moving through a transit hub.",
      badgeClassName: "bg-indigo-100 text-indigo-700",
    },
    {
      code: "arrived_at_destination_depot",
      label: "Arrived at Destination Depot",
      description: "The shipment has arrived at the destination depot.",
      badgeClassName: "bg-indigo-100 text-indigo-700",
    },
    {
      code: "linehaul_in_progress",
      label: "Linehaul in Progress",
      description: "The shipment is moving on a long-haul road leg.",
      badgeClassName: "bg-blue-100 text-blue-700",
    },
    {
      code: "out_for_delivery",
      label: "Out for Delivery",
      description: "The shipment is with the courier for final delivery.",
      badgeClassName: "bg-amber-100 text-amber-700",
    },
    {
      code: "delivery_attempted",
      label: "Delivery Attempted",
      description: "The courier attempted delivery but could not complete it.",
      badgeClassName: "bg-amber-50 text-amber-700",
    },
  ],
  freight: [
    {
      code: "freight_booking_confirmed",
      label: "Freight Booking Confirmed",
      description: "The freight movement has been confirmed.",
      badgeClassName: "bg-sky-100 text-sky-700",
    },
    {
      code: "cargo_received",
      label: "Cargo Received",
      description: "The cargo has been received for freight handling.",
      badgeClassName: "bg-orange-100 text-orange-700",
    },
    {
      code: "palletized_consolidated",
      label: "Palletized / Consolidated",
      description: "The cargo has been palletized or consolidated.",
      badgeClassName: "bg-cyan-100 text-cyan-700",
    },
    {
      code: "loaded_for_dispatch",
      label: "Loaded for Dispatch",
      description: "The freight has been loaded for dispatch.",
      badgeClassName: "bg-blue-100 text-blue-700",
    },
    {
      code: "in_linehaul",
      label: "In Linehaul",
      description: "The freight is moving on its main linehaul leg.",
      badgeClassName: "bg-blue-100 text-blue-700",
    },
    {
      code: "at_cross_dock_facility",
      label: "At Cross-Dock Facility",
      description: "The freight is being handled at a cross-dock facility.",
      badgeClassName: "bg-indigo-100 text-indigo-700",
    },
    {
      code: "awaiting_delivery_appointment",
      label: "Awaiting Delivery Appointment",
      description: "The shipment is waiting for a delivery appointment.",
      badgeClassName: "bg-yellow-100 text-yellow-800",
    },
    {
      code: "delivery_appointment_confirmed",
      label: "Delivery Appointment Confirmed",
      description: "The delivery appointment has been confirmed.",
      badgeClassName: "bg-sky-100 text-sky-700",
    },
    {
      code: "unloaded_at_destination_facility",
      label: "Unloaded at Destination Facility",
      description: "The freight has been unloaded at the destination facility.",
      badgeClassName: "bg-indigo-100 text-indigo-700",
    },
    {
      code: "proof_of_delivery_received",
      label: "Proof of Delivery Received",
      description: "Proof of delivery has been received for the freight.",
      badgeClassName: "bg-emerald-100 text-emerald-700",
    },
  ],
} as const satisfies Record<
  TransportMode,
  readonly ShipmentStatusDefinition[]
>;

export const allShipmentStatusDefinitions = [
  ...commonShipmentStatusDefinitions,
  ...modeShipmentStatusDefinitions.air,
  ...modeShipmentStatusDefinitions.road,
  ...modeShipmentStatusDefinitions.freight,
] as const;

export type ShipmentStatus =
  (typeof allShipmentStatusDefinitions)[number]["code"];

export type LegacyShipmentStatus =
  | "label_created"
  | "picked_up"
  | "arrived_at_hub"
  | "customs_clearance"
  | "received_at_origin_facility"
  | "departed_origin_facility"
  | "arrived_at_destination_facility";

type DirectLegacyShipmentStatus =
  | "label_created"
  | "picked_up"
  | "customs_clearance";

export type ShipmentStatusInput = ShipmentStatus | LegacyShipmentStatus | string;

export type ShipmentStatusMeta = {
  code: ShipmentStatus;
  label: string;
  description: string;
  badgeClassName: string;
  isLegacy: boolean;
  originalCode: string;
  mode: TransportMode;
};

export const transportModes = transportModeDefinitions.map(
  (mode) => mode.code,
) as [TransportMode, ...TransportMode[]];

export const shipmentStatuses = Array.from(
  new Set(allShipmentStatusDefinitions.map((status) => status.code)),
) as [ShipmentStatus, ...ShipmentStatus[]];

export const activeShipmentStatuses = [
  ...shipmentStatuses.filter(
    (status) =>
      !["delivered", "returned_to_sender", "cancelled"].includes(status),
  ),
  "label_created",
  "picked_up",
  "arrived_at_hub",
  "customs_clearance",
  "received_at_origin_facility",
  "departed_origin_facility",
  "arrived_at_destination_facility",
] as const;

const definitionByCode = new Map(
  allShipmentStatusDefinitions.map((status) => [status.code, status]),
);

const serviceDefinitionByCode = new Map(
  allModeAwareServiceDefinitions.map((service) => [service.code, service]),
);

const transportModeSet = new Set<string>(transportModes);

const defaultServiceTypeByMode = {
  air: "standard_air",
  road: "standard_road",
  freight: "consolidated_freight",
} as const satisfies Record<TransportMode, ModeAwareServiceType>;

const legacyServiceTypeMap = {
  air: {
    Express: "express_air",
    Economy: "standard_air",
  },
  road: {
    Express: "same_day_road",
    Economy: "standard_road",
  },
  freight: {
    Express: "full_truckload",
    Economy: "consolidated_freight",
  },
} as const satisfies Record<
  TransportMode,
  Record<LegacyServiceType, ModeAwareServiceType>
>;

export function normalizeTransportMode(mode: string | null | undefined) {
  const normalized = mode?.trim().toLowerCase() ?? "";

  return transportModeSet.has(normalized)
    ? (normalized as TransportMode)
    : "road";
}

export function getTransportModeMeta(mode: string | null | undefined) {
  const normalized = normalizeTransportMode(mode);

  return (
    transportModeDefinitions.find((definition) => definition.code === normalized) ??
    transportModeDefinitions[1]
  );
}

function normalizeLegacyServiceTier(
  serviceType: string,
): LegacyServiceType | null {
  const normalized = serviceType.trim().toLowerCase();

  if (normalized === "express") {
    return "Express";
  }

  if (normalized === "economy") {
    return "Economy";
  }

  return null;
}

export function getModeAwareServiceOptions(
  mode: string | null | undefined,
): ModeAwareServiceDefinition[] {
  const normalizedMode = normalizeTransportMode(mode);

  return [...modeAwareServiceDefinitions[normalizedMode]];
}

export function getDefaultModeAwareServiceType(
  mode: string | null | undefined,
): ModeAwareServiceType {
  return defaultServiceTypeByMode[normalizeTransportMode(mode)];
}

export function normalizeModeAwareServiceType(
  serviceType: ShipmentServiceTypeInput,
  options?: {
    mode?: string | null;
  },
): ModeAwareServiceType {
  const originalCode = serviceType.trim();
  const mode = normalizeTransportMode(options?.mode);

  if (serviceDefinitionByCode.has(originalCode as ModeAwareServiceType)) {
    return originalCode as ModeAwareServiceType;
  }

  const legacyTier = normalizeLegacyServiceTier(originalCode);

  if (legacyTier) {
    return legacyServiceTypeMap[mode][legacyTier];
  }

  return defaultServiceTypeByMode[mode];
}

export function isModeAwareServiceTypeForMode(
  serviceType: ShipmentServiceTypeInput,
  mode: string | null | undefined,
) {
  const normalizedMode = normalizeTransportMode(mode);
  const normalizedServiceType = normalizeModeAwareServiceType(serviceType, {
    mode: normalizedMode,
  });

  return modeAwareServiceDefinitions[normalizedMode].some(
    (service) => service.code === normalizedServiceType,
  );
}

export function getModeAwareServiceMeta(
  serviceType: ShipmentServiceTypeInput,
  options?: {
    mode?: string | null;
  },
): ModeAwareServiceMeta {
  const originalCode = serviceType.trim();
  const normalizedCode = normalizeModeAwareServiceType(originalCode, options);
  const definition =
    serviceDefinitionByCode.get(normalizedCode) ??
    serviceDefinitionByCode.get(defaultServiceTypeByMode.road);

  return {
    code: normalizedCode,
    label: definition?.label ?? "Standard Road",
    description:
      definition?.description ??
      "Standard road network service for routine shipments.",
    transportMode: definition?.transportMode ?? "road",
    pricingTier: definition?.pricingTier ?? "Economy",
    estimatedTransitDays: definition?.estimatedTransitDays ?? 4,
    isLegacy: originalCode !== normalizedCode,
    originalCode,
  };
}

export function getPricingServiceTypeForModeAwareService(
  serviceType: ShipmentServiceTypeInput,
  mode?: string | null,
): PricingServiceTier {
  return getModeAwareServiceMeta(serviceType, { mode }).pricingTier;
}

export function formatModeAwareServiceType(
  serviceType: ShipmentServiceTypeInput,
  mode?: string | null,
) {
  return getModeAwareServiceMeta(serviceType, { mode }).label;
}

export function getShipmentStatusOptions(
  mode: string | null | undefined,
): ShipmentStatusDefinition[] {
  const normalizedMode = normalizeTransportMode(mode);
  const seen = new Set<string>();

  return [
    ...commonShipmentStatusDefinitions,
    ...modeShipmentStatusDefinitions[normalizedMode],
  ].filter((status) => {
    if (seen.has(status.code)) {
      return false;
    }

    seen.add(status.code);

    return true;
  });
}

export const legacyShipmentStatusMap = {
  label_created: "shipment_created",
  picked_up: "collected",
  customs_clearance: "customs_clearance_in_progress",
} as const satisfies Record<DirectLegacyShipmentStatus, ShipmentStatus>;

function normalizeModeAwareLegacyStatus(
  status: LegacyShipmentStatus,
  mode: TransportMode,
): ShipmentStatus {
  if (status === "arrived_at_hub") {
    if (mode === "air") {
      return "arrived_at_transit_airport";
    }

    if (mode === "freight") {
      return "at_cross_dock_facility";
    }

    return "at_transit_hub";
  }

  if (status === "received_at_origin_facility") {
    if (mode === "air") {
      return "tendered_to_airline";
    }

    if (mode === "freight") {
      return "cargo_received";
    }

    return "route_assigned";
  }

  if (status === "departed_origin_facility") {
    if (mode === "air") {
      return "departed_origin_airport";
    }

    if (mode === "freight") {
      return "loaded_for_dispatch";
    }

    return "departed_origin_depot";
  }

  if (status === "arrived_at_destination_facility") {
    if (mode === "air") {
      return "arrived_at_destination_airport";
    }

    if (mode === "freight") {
      return "unloaded_at_destination_facility";
    }

    return "arrived_at_destination_depot";
  }

  if (status in legacyShipmentStatusMap) {
    return legacyShipmentStatusMap[status as DirectLegacyShipmentStatus];
  }

  return "exception";
}

export function normalizeShipmentStatus(
  status: ShipmentStatusInput,
  options?: {
    mode?: string | null;
    arrivedAtHubAs?: "received_at_origin_facility";
  },
): ShipmentStatus {
  const normalized = status.trim();
  const mode = normalizeTransportMode(options?.mode);

  if (definitionByCode.has(normalized as ShipmentStatus)) {
    return normalized as ShipmentStatus;
  }

  if (normalized in legacyShipmentStatusMap) {
    return legacyShipmentStatusMap[
      normalized as keyof typeof legacyShipmentStatusMap
    ];
  }

  if (
    normalized === "arrived_at_hub" ||
    normalized === "received_at_origin_facility" ||
    normalized === "departed_origin_facility" ||
    normalized === "arrived_at_destination_facility"
  ) {
    if (
      normalized === "arrived_at_hub" &&
      options?.arrivedAtHubAs === "received_at_origin_facility"
    ) {
      return normalizeModeAwareLegacyStatus(
        "received_at_origin_facility",
        mode,
      );
    }

    return normalizeModeAwareLegacyStatus(
      normalized as LegacyShipmentStatus,
      mode,
    );
  }

  return "exception";
}

export function getShipmentStatusMeta(
  status: ShipmentStatusInput,
  options?: Parameters<typeof normalizeShipmentStatus>[1],
): ShipmentStatusMeta {
  const mode = normalizeTransportMode(options?.mode);
  const originalCode = status.trim();
  const code = normalizeShipmentStatus(originalCode, options);
  const modeDefinition = getShipmentStatusOptions(mode).find(
    (definition) => definition.code === code,
  );
  const definition =
    modeDefinition ?? definitionByCode.get(code) ?? definitionByCode.get("exception");

  return {
    code,
    label: definition?.label ?? "Shipment Exception",
    description:
      definition?.description ??
      "The shipment needs attention because an exception occurred.",
    badgeClassName: definition?.badgeClassName ?? "bg-rose-100 text-rose-700",
    isLegacy: originalCode !== code,
    originalCode,
    mode,
  };
}

export function formatShipmentStatus(
  status: ShipmentStatusInput,
  mode?: string | null,
) {
  return getShipmentStatusMeta(status, { mode }).label;
}
