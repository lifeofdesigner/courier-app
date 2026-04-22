export type CmsSidebarItem = {
  label: string;
  href: string;
  description: string;
  id?: string;
};

export type CmsSidebarProps = {
  items: CmsSidebarItem[];
  activeId?: string;
};

export function CmsSidebar({ items, activeId }: CmsSidebarProps) {
  return (
    <aside className="h-fit rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-4">
      <p className="px-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        CMS Sections
      </p>
      <nav aria-label="CMS sections" className="mt-3">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = activeId ? item.id === activeId : false;

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`block rounded-2xl px-3 py-3 transition focus:outline-none focus:ring-4 focus:ring-[#b0825f]/15 ${
                    isActive
                      ? "bg-[#2b1d16] text-white"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`block text-sm font-semibold ${
                      isActive ? "text-white" : "text-[#2b1d16]"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`mt-1 block text-xs leading-5 ${
                      isActive ? "text-white/70" : "text-slate-500"
                    }`}
                  >
                    {item.description}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
