type GradientButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function GradientButton({
  children,
  onClick,
  disabled = false,
  className = "",
}: GradientButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex w-full h-[54px] self-stretch items-center justify-center gap-2.5",
        "px-auto py-[10px]",
        "rounded-xl",
        "bg-[linear-gradient(92deg,#870199_22.49%,#E101FF_58.97%)]",
        "text-white font-semibold",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}