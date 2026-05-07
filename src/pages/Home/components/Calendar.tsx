import { useMemo } from "react";

interface CalendarProps {
  year: number;
  month: number; // 1-indexed (1=Jan, 12=Dec)
  selectedDate: number | null;
  eventDates: number[];
  onSelectDate: (day: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function getMonthLabel(year: number, month: number) {
  const date = new Date(year, month - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function Calendar({
  year,
  month,
  selectedDate,
  eventDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: CalendarProps) {
  const days = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

    const cells: { day: number; isCurrentMonth: boolean }[] = [];

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, isCurrentMonth: true });
    }

    return cells;
  }, [year, month]);

  const eventDateSet = useMemo(() => new Set(eventDates), [eventDates]);

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-on-surface">
          {getMonthLabel(year, month)}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={onPrevMonth}
            className="p-1 rounded-full hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              chevron_left
            </span>
          </button>
          <button
            onClick={onNextMonth}
            className="p-1 rounded-full hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-xl p-3 shadow-sm">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-3 text-center">
          {WEEKDAYS.map((d, i) => (
            <span
              key={i}
              className="text-xs font-semibold text-on-surface-variant"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-3 text-center">
          {days.map((cell, i) => {
            if (!cell.isCurrentMonth) {
              return (
                <span key={i} className="text-sm text-on-surface-variant/40">
                  {cell.day}
                </span>
              );
            }

            const isSelected = cell.day === selectedDate;
            const hasEvent = eventDateSet.has(cell.day);

            return (
              <button
                key={i}
                onClick={() => onSelectDate(cell.day)}
                className="relative flex items-center justify-center h-8"
              >
                {isSelected && (
                  <div className="absolute w-8 h-8 bg-primary rounded-full" />
                )}
                {!isSelected && hasEvent && (
                  <div className="absolute w-8 h-8 bg-surface-container-highest rounded-full" />
                )}
                <span
                  className={`relative text-sm ${
                    isSelected
                      ? "text-on-primary font-bold"
                      : "text-on-surface"
                  }`}
                >
                  {cell.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
