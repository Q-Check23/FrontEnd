import { useToastStore, type ToastVariant } from "../stores/useToastStore";

const VARIANT_STYLES: Record<
  ToastVariant,
  { container: string; icon: string }
> = {
  success: {
    container: "bg-emerald-600 text-white",
    icon: "check_circle",
  },
  error: {
    container: "bg-red-600 text-white",
    icon: "error",
  },
  info: {
    container: "bg-on-surface/90 text-surface",
    icon: "info",
  },
};

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed left-1/2 bottom-24 z-[100] flex flex-col gap-2 -translate-x-1/2 items-center pointer-events-none w-[calc(100%-2rem)] max-w-sm">
      {toasts.map((t) => {
        const style = VARIANT_STYLES[t.variant];
        return (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-xl pointer-events-auto whitespace-pre-line text-center ${style.container}`}
            style={{ animation: "toastFadeIn 0.22s ease-out" }}
          >
            <span className="material-symbols-outlined text-[20px] shrink-0">
              {style.icon}
            </span>
            <span className="flex-1">{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
