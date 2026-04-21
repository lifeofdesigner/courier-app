import type { AuthActionState } from "@/types/auth";

export type AuthMessageProps = {
  state?: AuthActionState | null;
  message?: string;
};

export function AuthMessage({ state, message }: AuthMessageProps) {
  const visibleMessage = state?.message ?? message;

  if (!visibleMessage) {
    return null;
  }

  const toneClasses = state?.success
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClasses}`}>
      {visibleMessage}
    </div>
  );
}
