export type CmsSidebarItem = {
  label: string;
  href: string;
  description: string;
};

export type CmsSidebarProps = {
  items: CmsSidebarItem[];
};

export function CmsSidebar({ items }: CmsSidebarProps) {
  return (
    <aside className="h-fit rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <p className="px-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        CMS Sections
      </p>
      <nav aria-label="CMS sections" className="mt-3">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="block rounded-2xl px-3 py-3 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/15"
              >
                <span className="block text-sm font-semibold text-[#0B1C3A]">
                  {item.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {item.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
