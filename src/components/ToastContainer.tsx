import { useToastStore } from "../stores/useToastStore";

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed left-4 bottom-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="px-4 py-3 rounded-xl bg-on-surface/80 text-surface text-sm shadow-lg animate-[fadeIn_0.2s_ease-out]"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
