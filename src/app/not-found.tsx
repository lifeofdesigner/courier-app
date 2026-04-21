import Link from "next/link";
import { Home, MapPinned, MessageCircle, PackageSearch } from "lucide-react";

const links = [
  {
    label: "Go home",
    href: "/",
    icon: Home,
  },
  {
    label: "View services",
    href: "/services",
    icon: MapPinned,
  },
  {
    label: "Track shipment",
    href: "/track",
    icon: PackageSearch,
  },
  {
    label: "Contact support",
    href: "/contact",
    icon: MessageCircle,
  },
] as const;

export default function NotFound() {
  return (
    <main>
      <section className="py-16 lg:py-20">
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
            404
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-[#0B1C3A] lg:text-5xl">
            This delivery route does not exist.
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            The page may have moved, the link may be outdated, or the shipment
            reference may belong in tracking instead.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {links.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Icon
                    aria-hidden="true"
                    className="h-5 w-5 text-[#FF6B2B]"
                  />
                  <span className="mt-4 block font-heading text-lg font-bold tracking-tight text-[#0B1C3A]">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
