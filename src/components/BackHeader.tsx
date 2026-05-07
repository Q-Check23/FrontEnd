import { useNavigate } from "react-router-dom";

interface BackHeaderProps {
  title?: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

export default function BackHeader({ title, subtitle, rightSlot }: BackHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md shadow-sm flex items-center px-5 h-14 w-full">
      <button
        onClick={() => navigate(-1)}
        className="material-symbols-outlined text-on-surface active:scale-95 transition-transform p-1"
      >
        arrow_back
      </button>
      {(title || subtitle) && (
        <div className="ml-4 flex flex-col justify-center">
          {title && (
            <h1 className="text-xl font-semibold text-on-surface leading-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <span className="text-xs font-semibold text-on-surface-variant">
              {subtitle}
            </span>
          )}
        </div>
      )}
      {rightSlot && <div className="ml-auto">{rightSlot}</div>}
    </header>
  );
}
