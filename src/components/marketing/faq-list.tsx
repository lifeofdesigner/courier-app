export type FAQGroup = {
  title: string;
  items: readonly {
    question: string;
    answer: string;
  }[];
};

type FAQListProps = {
  groups: readonly FAQGroup[];
};

export function FAQList({ groups }: FAQListProps) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.title}>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[#0B1C3A]">
            {group.title}
          </h2>
          <div className="mt-5 space-y-4">
            {group.items.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[24px] border border-slate-200 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-base font-bold text-[#0B1C3A]">
                  {faq.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-[#FF6B2B] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="border-t border-slate-200 px-6 py-5 text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
