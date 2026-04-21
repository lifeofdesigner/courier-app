import type { QuoteActionState } from "@/app/(public)/quote/actions";

export type QuoteResultStateProps = {
  state: QuoteActionState;
};

export function QuoteResultState({ state }: QuoteResultStateProps) {
  if (!state.message) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        state.success
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-800"
      }`}
    >
      {state.message}
    </div>
  );
}
