type BlogRichContentProps = {
  contentHtml: string;
  takeaways?: string[];
};

export function BlogRichContent({
  contentHtml,
  takeaways,
}: BlogRichContentProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
      {takeaways?.length ? (
        <aside className="mb-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold tracking-tight text-navy">
            Key takeaways
          </h2>
          <ul className="mt-4 space-y-3">
            {takeaways.map((takeaway) => (
              <li
                key={takeaway}
                className="flex gap-3 text-sm leading-7 text-slate-600"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div
          className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-navy prose-p:text-slate-600 prose-li:text-slate-600"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </div>
  );
}
