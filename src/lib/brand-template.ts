const SITE_NAME_TOKEN = "{siteName}";
const LEGACY_SITE_NAMES = ["Atlas Courier"];

export function applySiteNameTemplate<T>(value: T, siteName: string): T {
  if (typeof value === "string") {
    let nextValue = value.replaceAll(SITE_NAME_TOKEN, siteName);

    for (const legacySiteName of LEGACY_SITE_NAMES) {
      nextValue = nextValue.replaceAll(legacySiteName, siteName);
    }

    return nextValue as T;
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
