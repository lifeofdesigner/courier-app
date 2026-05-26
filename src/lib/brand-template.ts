import type { TrackingEventItem } from "@/types/shipment";

const SITE_NAME_TOKEN = "{siteName}";
const OPERATIONS_LOCATION_PATTERN = /^(?:.+\s+)?operations(?:\s+team)?$/i;

export function applySiteNameTemplate<T>(value: T, siteName: string): T {
  if (typeof value === "string") {
    return value.replaceAll(SITE_NAME_TOKEN, siteName) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => applySiteNameTemplate(item, siteName)) as T;
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        applySiteNameTemplate(item, siteName),
      ]),
    ) as T;
  }

  return value;
}

export function applySiteNameToOperationsLocation(
  value: string | null,
  siteName: string,
) {
  const locationName = value?.trim();

  if (!locationName) {
    return null;
  }

  if (OPERATIONS_LOCATION_PATTERN.test(locationName)) {
    return `${siteName} operations`;
  }

  return applySiteNameTemplate(locationName, siteName);
}

export function applySiteNameToTrackingEvents(
  events: TrackingEventItem[],
  siteName: string,
) {
  return applySiteNameTemplate(events, siteName).map((event) => ({
    ...event,
    locationName: applySiteNameToOperationsLocation(
      event.locationName,
      siteName,
    ),
  }));
}
