import type { CalendarEvent } from "../../../api/calendar";

interface EventSearchCardProps {
  event: CalendarEvent;
  onClick?: () => void;
}

function formatDate(startTime: string) {
  if (!startTime) return "";
  try {
    const d = new Date(startTime);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}.${m}.${day}`;
    }
  } catch {
    // fallback
  }
  return startTime;
}

export default function EventSearchCard({ event, onClick }: EventSearchCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10 flex items-center gap-4 active:scale-95 transition-transform text-left"
    >
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <h3 className="text-base font-medium text-on-surface truncate">
            {event.eventTitle}
          </h3>
          <span className="text-xs font-semibold text-on-surface-variant whitespace-nowrap ml-2">
            {formatDate(event.startTime)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary">
            {event.clubName}
          </span>
          {event.location && (
            <>
              <span className="w-1 h-1 bg-outline-variant rounded-full" />
              <span className="text-xs font-semibold text-on-surface-variant">
                {event.location}
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
