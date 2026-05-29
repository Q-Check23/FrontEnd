import type { CalendarEvent } from "../../../api/calendar";
import ScheduleCard from "./ScheduleCard";
import { parseKST } from "../../../lib/datetime";

interface ScheduleListProps {
  year: number;
  month: number;
  day: number;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

function formatDateHeading(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  return `${mm}/${dd} ${weekday}`;
}

function formatTime(startTime: string) {
  if (!startTime) return "";
  // startTime comes as ISO or "HH:mm" format
  try {
    const date = parseKST(startTime);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  } catch {
    // fallback
  }
  return startTime;
}

export default function ScheduleList({
  year,
  month,
  day,
  events,
  onEventClick,
}: ScheduleListProps) {
  return (
    <section>
      <div className="flex items-center gap-1 mb-3">
        <span className="w-1 h-6 bg-primary rounded-full" />
        <h3 className="text-xl font-semibold text-on-surface">
          {formatDateHeading(year, month, day)}
        </h3>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-on-surface-variant py-8 text-center">
          일정이 없습니다
        </p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <ScheduleCard
              key={event.eventId}
              clubName={event.clubName}
              eventTitle={event.eventTitle}
              location={event.location}
              time={formatTime(event.startTime)}
              participated={false}
              onClick={() => onEventClick?.(event)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
