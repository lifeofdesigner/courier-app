type LegalSection = {
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

type LegalContentProps = {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
};

export function LegalContent({
  eyebrow,
  title,
  description,
  lastUpdated,
  sections,
}: LegalContentProps) {
  return (
    <main>
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-navy lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            {description}
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Last updated: {lastUpdated}
          </p>

          <article className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-navy prose-p:text-slate-600 prose-li:text-slate-600">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets?.length ? (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
