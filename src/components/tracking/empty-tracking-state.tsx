import { PackageSearch } from "lucide-react";

export type EmptyTrackingStateProps = {
  title: string;
  description: string;
};

export function EmptyTrackingState({
  title,
  description,
}: EmptyTrackingStateProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <PackageSearch aria-hidden="true" className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-tight text-navy">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
        {description}
      </p>
    </div>
  );
}
