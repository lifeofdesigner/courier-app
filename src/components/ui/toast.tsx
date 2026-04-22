"use client";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  LoaderCircle,
  X,
  XCircle,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastInput = {
  id?: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastItem = {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  duration: number;
};

type ToastContextValue = {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<
  ToastVariant,
  {
    icon: typeof CheckCircle2;
    title: string;
    className: string;
    iconClassName: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    title: "Success",
    className: "border-emerald-200 bg-emerald-50 text-emerald-950",
    iconClassName: "text-emerald-600",
  },
  error: {
    icon: XCircle,
    title: "Error",
    className: "border-rose-200 bg-rose-50 text-rose-950",
    iconClassName: "text-rose-600",
  },
  warning: {
    icon: AlertCircle,
    title: "Needs attention",
    className: "border-amber-200 bg-amber-50 text-amber-950",
    iconClassName: "text-amber-600",
  },
  info: {
    icon: Info,
    title: "Update",
    className: "border-slate-200 bg-white text-slate-950",
    iconClassName: "text-[#0B1C3A]",
  },
};

function createToastId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = input.id ?? createToastId();
      const duration = input.duration ?? 5200;
      const nextToast: ToastItem = {
        id,
        title: input.title,
        message: input.message,
        variant: input.variant ?? "info",
        duration,
      };

      const existingTimer = timersRef.current.get(id);

      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      setToasts((currentToasts) => {
        const withoutDuplicate = currentToasts.filter(
          (currentToast) => currentToast.id !== id,
        );

        return [nextToast, ...withoutDuplicate].slice(0, 4);
      });

      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [dismiss, toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions text"
        className="pointer-events-none fixed inset-x-4 top-4 z-[1000] flex flex-col gap-3 sm:left-auto sm:right-5 sm:w-full sm:max-w-sm"
      >
        {toasts.map((toastItem) => (
          <ToastCard
            key={toastItem.id}
            toast={toastItem}
            onDismiss={() => dismiss(toastItem.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const styles = variantStyles[toast.variant];
  const Icon = styles.icon ?? LoaderCircle;

  return (
    <div
      role={toast.variant === "error" || toast.variant === "warning" ? "alert" : "status"}
      className={`pointer-events-auto rounded-[20px] border p-4 shadow-lg shadow-slate-950/10 ${styles.className}`}
    >
      <div className="flex gap-3">
        <Icon
          aria-hidden="true"
          className={`mt-0.5 h-5 w-5 shrink-0 ${styles.iconClassName}`}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">
            {toast.title ?? styles.title}
          </p>
          <p className="mt-1 text-sm leading-5 opacity-85">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-current opacity-60 transition hover:bg-white/70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current/20"
          aria-label="Dismiss notification"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}
