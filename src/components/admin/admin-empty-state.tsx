import { ClipboardList } from "lucide-react";

export type AdminEmptyStateProps = {
  title: string;
  description: string;
};

export function AdminEmptyState({ title, description }: AdminEmptyStateProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#b0825f] shadow-sm">
        <ClipboardList aria-hidden="true" className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-bold tracking-tight text-[#2b1d16]">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}
