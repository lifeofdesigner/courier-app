type AboutStorySectionProps = {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  stats: readonly {
    value: string;
    label: string;
  }[];
};

export function AboutStorySection({
  eyebrow,
  title,
  paragraphs,
  stats,
}: AboutStorySectionProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-start">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-navy">
          {title}
        </h2>
        <div className="mt-5 space-y-4">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8 text-slate-600">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <div className="grid gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="font-heading text-3xl font-bold tracking-tight text-navy">
              {stat.value}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
