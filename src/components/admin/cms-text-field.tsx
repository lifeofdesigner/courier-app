export type CmsTextFieldProps = {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: "email" | "tel" | "text" | "url";
  placeholder?: string;
  helpText?: string;
  required?: boolean;
};

export const cmsInputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

export function CmsTextField({
  label,
  name,
  defaultValue = "",
  type = "text",
  placeholder,
  helpText,
  required,
}: CmsTextFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-[#0B1C3A]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={cmsInputClassName}
      />
      {helpText ? <p className="text-xs leading-5 text-slate-500">{helpText}</p> : null}
    </div>
  );
}
