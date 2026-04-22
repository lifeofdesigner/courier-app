export type AdminStatusTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent";

export type AdminStatusPillProps = {
  label: string;
  tone?: AdminStatusTone;
  className?: string;
};

const toneClasses: Record<AdminStatusTone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700",
  info: "bg-blue-50 text-blue-700",
  accent: "bg-[#f4efe8] text-[#2b1d16]",
};

export function AdminStatusPill({
  label,
  tone = "neutral",
  className,
}: AdminStatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        toneClasses[tone]
      } ${className ?? ""}`}
    >
      {label}
    </span>
  );
}
