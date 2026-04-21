import type { AdminCmsRow } from "@/types/admin";

export type CmsPreviewCardProps = {
  row: AdminCmsRow;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function CmsPreviewCard({ row }: CmsPreviewCardProps) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#0B1C3A]">
            {row.section} / {row.key}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Updated {formatDate(row.updatedAt)}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            row.published
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {row.published ? "Published" : "Draft"}
        </span>
      </div>
      <pre className="mt-4 max-h-48 overflow-auto rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">
        {JSON.stringify(row.value, null, 2)}
      </pre>
    </div>
  );
}
