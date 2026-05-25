const SITE_NAME_TOKEN = "{siteName}";

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
