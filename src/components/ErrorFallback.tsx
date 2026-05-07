interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorFallback({
  message = "데이터를 불러올 수 없습니다",
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <span className="material-symbols-outlined text-on-surface-variant text-4xl">
        error_outline
      </span>
      <p className="text-sm text-on-surface-variant text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold active:scale-95 transition-transform"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
