export type PreservedFormValues = Record<string, string>;

const sensitiveFieldPatterns = [
  "password",
  "confirmPassword",
  "secret",
  "token",
] as const;

function isSensitiveField(key: string) {
  const normalizedKey = key.toLowerCase();

  return sensitiveFieldPatterns.some((pattern) =>
    normalizedKey.includes(pattern.toLowerCase()),
  );
}

export function formDataToValues(formData: FormData): PreservedFormValues {
  const values: PreservedFormValues = {};

  for (const [key, value] of formData.entries()) {
    if (isSensitiveField(key) || typeof value !== "string") {
      continue;
    }

    values[key] = value;
  }

  return values;
}
