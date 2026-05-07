import type { ClubSummary } from "../../../api/clubs";

interface ClubCardProps {
  club: ClubSummary;
  onClick?: () => void;
}

export default function ClubCard({ club, onClick }: ClubCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full relative overflow-hidden rounded-xl bg-white shadow-md transition-all active:scale-[0.98] text-left"
    >
      <div className="h-[3px] w-full bg-gradient-to-r from-primary-bright to-primary" />
      <div className="px-6 py-5 flex flex-col gap-4">
        <h2 className="font-bold text-lg text-on-surface tracking-tight">
          {club.clubName}
        </h2>
        <div className="flex justify-end">
          <span className="text-xs font-bold text-primary-bright">
            자세히 보기 &gt;
          </span>
        </div>
      </div>
    </button>
  );
}
