import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import type { FormFieldBaseProps } from "@/types/ui";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  FormFieldBaseProps;

export function Textarea({
  className,
  label,
  helperText,
  error,
  id,
  name,
  rows = 5,
  ...props
}: TextareaProps) {
  const fieldId = id ?? name;

  return (
    <div className="space-y-2">
      {label ? (
        <label
          htmlFor={fieldId}
          className="block text-sm font-semibold text-navy"
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={fieldId}
        name={name}
        rows={rows}
        className={cn(
          "w-full resize-y rounded-md border border-border bg-white px-3 py-3 text-sm text-text shadow-sm outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-100",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
