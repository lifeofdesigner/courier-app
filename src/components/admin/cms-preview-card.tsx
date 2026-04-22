export type CmsPreviewCardProps = {
  title: string;
  description: string;
  published: boolean;
  updatedAt?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Not saved yet";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function CmsPreviewCard({
  title,
  description,
  published,
  updatedAt,
}: CmsPreviewCardProps) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-[#2b1d16]">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${
            published
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {published ? "Published" : "Draft"}
        </span>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Updated {formatDate(updatedAt)}
      </p>
    </article>
  );
}
