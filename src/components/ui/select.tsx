import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import type { FormFieldBaseProps } from "@/types/ui";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  FormFieldBaseProps & {
    options: SelectOption[];
    placeholder?: string;
  };

export function Select({
  className,
  label,
  helperText,
  error,
  id,
  name,
  options,
  placeholder,
  ...props
}: SelectProps) {
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
      <select
        id={fieldId}
        name={name}
        className={cn(
          "h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-text shadow-sm outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-100",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
          className,
        )}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
