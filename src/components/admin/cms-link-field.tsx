import { CmsTextField } from "@/components/admin/cms-text-field";
import type { CmsLink } from "@/types/cms";

export type CmsLinkFieldProps = {
  label: string;
  name: string;
  defaultValue?: Partial<CmsLink>;
  includeAriaLabel?: boolean;
};

export function CmsLinkField({
  label,
  name,
  defaultValue,
  includeAriaLabel = true,
}: CmsLinkFieldProps) {
  return (
    <fieldset className="rounded-[24px] border border-slate-200 bg-white p-4">
      <legend className="px-2 text-sm font-semibold text-[#2b1d16]">
        {label}
      </legend>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <CmsTextField
          label="Button text"
          name={`${name}.label`}
          defaultValue={defaultValue?.label}
        />
        <CmsTextField
          label="Button link"
          name={`${name}.href`}
          defaultValue={defaultValue?.href}
        />
        {includeAriaLabel ? (
          <div className="md:col-span-2">
            <CmsTextField
              label="Accessible label"
              name={`${name}.ariaLabel`}
              defaultValue={defaultValue?.ariaLabel}
            />
          </div>
        ) : null}
      </div>
    </fieldset>
  );
}
