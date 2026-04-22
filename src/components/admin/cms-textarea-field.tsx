export type CmsTextareaFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  rows?: number;
};

export const cmsTextareaClassName =
  "min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

export function CmsTextareaField({
  label,
  name,
  defaultValue = "",
  placeholder,
  helpText,
  required,
  rows,
}: CmsTextareaFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-[#2b1d16]">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={cmsTextareaClassName}
      />
      {helpText ? <p className="text-xs leading-5 text-slate-500">{helpText}</p> : null}
    </div>
  );
}
