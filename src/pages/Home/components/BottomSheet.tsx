import { useCallback, useMemo, useRef, useState } from "react";
import { type CalendarEvent } from "../../../api/calendar";
import { useCalendarSearch, useCalendarFilter, useMyClubs, useDebouncedValue } from "../../../hooks";
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
  const [activeFilter, setActiveFilter] = useState<"period" | "club" | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedClub, setSelectedClub] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebouncedValue(query, 300);
  const hasQuery = debouncedQuery.trim().length > 0;

  const filterParams = useMemo(() => ({
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
    ...(selectedClub ? { clubName: selectedClub } : {}),
  }), [startDate, endDate, selectedClub]);

  const { data: searchResults = [] } = useCalendarSearch(debouncedQuery, open && hasQuery);
  const { data: filterResults = [] } = useCalendarFilter(filterParams, open && !hasQuery);
  const { data: clubs = [] } = useMyClubs();

  const results = hasQuery ? searchResults : filterResults;

  const handleTogglePeriod = useCallback(() => {
    setActiveFilter((prev) => (prev === "period" ? null : "period"));
  }, []);

  const handleToggleClub = useCallback(() => {
    setActiveFilter((prev) => (prev === "club" ? null : "club"));
  }, []);

  const handleResetFilters = useCallback(() => {
    setStartDate("");
    setEndDate("");
    setSelectedClub("");
    setActiveFilter(null);
  }, []);

  const hasActiveFilters = startDate || endDate || selectedClub;

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
              activeFilter === "period" || startDate || endDate
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            기간
            <span className="material-symbols-outlined text-[16px]">
              keyboard_arrow_down
            </span>
          </button>
          <button
            onClick={handleToggleClub}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === "club" || selectedClub
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            모임
            <span className="material-symbols-outlined text-[16px]">
              keyboard_arrow_down
            </span>
          </button>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container-highest transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
              초기화
            </button>
          )}
        </div>

        {/* 기간 필터 패널 */}
        {activeFilter === "period" && (
          <div className="px-5 pb-4">
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-3">
              <p className="text-xs font-semibold text-on-surface-variant">기간 선택</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="min-w-0">
                  <label className="text-xs text-on-surface-variant block mb-1">시작일</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full min-w-0 bg-surface-container-low border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="min-w-0">
                  <label className="text-xs text-on-surface-variant block mb-1">종료일</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full min-w-0 bg-surface-container-low border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 모임 필터 패널 */}
        {activeFilter === "club" && (
          <div className="px-5 pb-4">
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-2">
              <p className="text-xs font-semibold text-on-surface-variant">모임 선택</p>
              <button
                onClick={() => setSelectedClub("")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !selectedClub
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-surface-container-low text-on-surface"
                }`}
              >
                전체
              </button>
              {clubs.map((club) => (
                <button
                  key={club.clubId}
                  onClick={() => setSelectedClub(club.clubName)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedClub === club.clubName
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-surface-container-low text-on-surface"
                  }`}
                >
                  {club.clubName}
                </button>
              ))}
            </div>
          </div>
        )}

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
