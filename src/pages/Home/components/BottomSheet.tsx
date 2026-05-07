import { useCallback, useRef, useState } from "react";
import { type CalendarEvent } from "../../../api/calendar";
import { useCalendarSearch, useCalendarFilter, useDebouncedValue } from "../../../hooks";
import EventSearchCard from "./EventSearchCard";

interface BottomSheetProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export default function BottomSheet({
  open,
  onOpen,
  onClose,
  onEventClick,
}: BottomSheetProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"period" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebouncedValue(query, 300);
  const hasQuery = debouncedQuery.trim().length > 0;

  const { data: searchResults = [] } = useCalendarSearch(debouncedQuery, open && hasQuery);
  const { data: filterResults = [] } = useCalendarFilter({}, open && !hasQuery);

  const results = hasQuery ? searchResults : filterResults;

  const handleTogglePeriod = useCallback(() => {
    setActiveFilter((prev) => (prev === "period" ? null : "period"));
  }, []);

  // Peeking state
  if (!open) {
    return (
      <div className="fixed bottom-20 left-0 right-0 z-40">
        <button
          onClick={onOpen}
          className="w-full bg-surface-container-lowest border-t border-x border-outline-variant/30 rounded-t-xl shadow-[0px_-8px_20px_0px_rgba(0,0,0,0.04)] h-8 flex flex-col items-center justify-start pt-2"
        >
          <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full" />
        </button>
      </div>
    );
  }

  // Expanded state
  return (
    <>
      {/* Scrim overlay */}
      <div
        className="fixed inset-0 bg-on-surface/40 z-[60] backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-[70] bg-surface rounded-t-[32px] shadow-[0px_-8px_40px_rgba(0,0,0,0.12)] flex flex-col h-[75vh]">
        {/* Handle */}
        <button
          onClick={onClose}
          className="flex justify-center pt-3 pb-2 w-full"
        >
          <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full" />
        </button>

        {/* 검색바 */}
        <div className="px-5 pt-2 pb-4">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-on-surface-variant">
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이벤트 검색"
              className="w-full bg-surface-container border-none rounded-xl h-12 pl-12 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* 필터 칩 */}
        <div className="px-5 flex gap-2 pb-4 overflow-x-auto">
          <button
            onClick={handleTogglePeriod}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === "period"
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            기간
            <span className="material-symbols-outlined text-[16px]">
              keyboard_arrow_down
            </span>
          </button>
          <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-semibold whitespace-nowrap hover:bg-surface-container-highest transition-colors">
            모임
          </button>
        </div>

        {/* 이벤트 목록 */}
        <div className="flex-1 overflow-y-auto px-5 pb-24 flex flex-col gap-3">
          {results.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-8 text-center">
              검색 결과가 없습니다
            </p>
          ) : (
            results.map((event) => (
              <EventSearchCard
                key={event.eventId}
                event={event}
                onClick={() => onEventClick?.(event)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
