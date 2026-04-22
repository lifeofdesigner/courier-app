import Link from "next/link";

export type AdminTabBarItem = {
  label: string;
  href: string;
  active?: boolean;
  count?: number;
};

export type AdminTabBarProps = {
  items: AdminTabBarItem[];
  ariaLabel: string;
};

export function AdminTabBar({ items, ariaLabel }: AdminTabBarProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-wrap gap-3 rounded-[20px] border border-slate-200 bg-[#f4efe8] p-3"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20 ${
            item.active
              ? "bg-white text-[#2b1d16] shadow-sm"
              : "text-[#2b1d16]/70 hover:bg-white/70 hover:text-[#2b1d16]"
          }`}
        >
          {item.label}
          {typeof item.count === "number" ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {item.count}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
