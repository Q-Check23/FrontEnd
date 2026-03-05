import { useNavigate } from "react-router-dom";

const BackArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 19l-7-7 7-7" />
  </svg>
);

type CreateEventHeaderProps = {
  onBackClick?: () => void;
  title?: string;
};

export default function CreateEventHeader({
  onBackClick,
  title = "새 행사 만들기",
}: CreateEventHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between w-full gap-4">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center justify-center flex-shrink-0 text-black hover:opacity-70 transition-opacity"
        aria-label="Go back"
      >
        <BackArrowIcon />
      </button>

      {/* Title */}
      <h1
        className="flex-1 text-center text-[20px] font-semibold text-black"
        style={{
          fontFamily: "Pretendard, sans-serif",
          fontVariationSettings: "'wdth' 100",
          lineHeight: "28px",
          letterSpacing: "0px",
        }}
      >
        {title}
      </h1>

      {/* Spacer to balance the back button */}
      <div className="flex-shrink-0 w-6" />
    </div>
  );
}
