export type CmsSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  published?: boolean;
};

export function CmsSectionHeader({
  eyebrow,
  title,
  description,
  published,
}: CmsSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-wide text-[#FF6B2B]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-xl font-bold tracking-tight text-[#0B1C3A]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>
      {typeof published === "boolean" ? (
        <span
          className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
            published
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {published ? "Published" : "Draft"}
        </span>
      ) : null}
    </div>
  );
}
