"use client";

import { useEffect, useRef } from "react";

import type { PreservedFormValues } from "@/lib/forms/preserve";

function restoreField(field: Element, value: string) {
  if (field instanceof HTMLInputElement) {
    if (field.type === "file" || field.type === "password") {
      return;
    }

    if (field.type === "checkbox") {
      field.checked = value === "on" || value === "true";
      return;
    }

    if (field.type === "radio") {
      field.checked = field.value === value;
      return;
    }

    field.value = value;
    return;
  }

  if (
    field instanceof HTMLTextAreaElement ||
    field instanceof HTMLSelectElement
  ) {
    field.value = value;
  }
}

export function usePreservedFormValues(
  values?: PreservedFormValues,
  onRestore?: (values: PreservedFormValues) => void,
) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!values || !formRef.current) {
      return;
    }

    for (const [name, value] of Object.entries(values)) {
      const field = formRef.current.elements.namedItem(name);

      if (!field) {
        continue;
      }

      if (field instanceof RadioNodeList) {
        field.value = value;
        continue;
      }

      restoreField(field, value);
    }

    onRestore?.(values);
  }, [onRestore, values]);

  return formRef;
}
