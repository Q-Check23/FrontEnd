interface ScheduleCardProps {
  clubName: string;
  eventTitle: string;
  location: string;
  time: string;
  participated: boolean;
  onClick?: () => void;
}

export default function ScheduleCard({
  clubName,
  eventTitle,
  location,
  time,
  participated,
  onClick,
}: ScheduleCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)] flex gap-4 items-center text-left"
    >
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            {clubName}
          </span>
          {participated ? (
            <span className="bg-primary/10 text-primary text-[10px] px-1 rounded font-bold">
              참여
            </span>
          ) : (
            <span className="bg-surface-container-highest text-on-surface-variant text-[10px] px-1 rounded font-bold">
              미참여
            </span>
          )}
        </div>
        <h4 className="text-base font-medium text-on-surface mt-1">
          {eventTitle}
        </h4>
        {location && (
          <div className="flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              location_on
            </span>
            <span className="text-sm text-on-surface-variant">{location}</span>
          </div>
        )}
        {time && (
          <div className="flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              schedule
            </span>
            <span className="text-sm text-on-surface-variant">{time}</span>
          </div>
        )}
      </div>
      <span className="material-symbols-outlined text-on-surface-variant">
        chevron_right
      </span>
    </button>
  );
}
