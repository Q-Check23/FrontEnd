import type { EventSummary } from "../../../api/events";

interface EventCardProps {
  event: EventSummary;
  onJoin?: () => void;
  onClick?: () => void;
}

function formatEventDate(startTime: string) {
  if (!startTime) return "";
  try {
    const d = new Date(startTime);
    if (!isNaN(d.getTime())) {
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
      const day = weekdays[d.getDay()];
      return `${mm}/${dd} (${day})`;
    }
  } catch {
    // fallback
  }
  return startTime;
}

function formatEventTime(startTime: string) {
  if (!startTime) return "";
  try {
    const d = new Date(startTime);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  } catch {
    // fallback
  }
  return "";
}

export default function EventCard({ event, onJoin, onClick }: EventCardProps) {
  const isClosed = !event.isActive;

  return (
    <div
      onClick={onClick}
      className={`bg-surface rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant/10${onClick ? " cursor-pointer" : ""}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-primary font-bold text-xs">
            {formatEventDate(event.startTime)}
          </span>
          {isClosed && (
            <span className="text-on-surface-variant text-xs">모집 마감</span>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
        <div className="space-y-1 mb-6 text-on-surface-variant text-sm">
          {event.startTime && (
            <div className="flex items-center gap-2">
              {formatEventTime(event.startTime)}
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">{event.location}</div>
          )}
        </div>
        {isClosed ? (
          <button
            disabled
            className="w-full py-3 bg-surface-variant text-on-surface-variant text-xs font-semibold rounded-xl cursor-not-allowed"
          >
            모집 마감
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onJoin?.();
            }}
            className="w-full py-3 bg-gradient-to-br from-primary-bright to-primary text-on-primary text-xs font-semibold rounded-xl active:scale-95 transition-transform"
          >
            참여하기
          </button>
        )}
      </div>
    </div>
  );
}
