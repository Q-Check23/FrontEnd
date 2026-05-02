import Calendar from "react-calendar";
import { useContext, useEffect, useMemo, useState } from "react";
import chevronUp from "../../assets/svg/ChevronUp.svg";
import search from "../../assets/svg/Search.svg";
import BottomBar from "../../components/BottomBar";
import { getMonthlyCalendar } from "../../api/calendar";
import { ToastContext } from "../../context/ToastContext";

const clubBadgeStyles = [
  "bg-green-100 text-green-700",
  "bg-blue-100 text-blue-700",
  "bg-orange-100 text-orange-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
];

function formatDateKeyFromDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateKeyFromString(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return formatDateKeyFromDate(date);
}

function formatSelectedDate(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).format(date);
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
  }).format(date);
}

function formatEventTime(value) {
  if (!value) {
    return "시간 미정";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function sortByStartTime(a, b) {
  return a.startTime.localeCompare(b.startTime);
}

export default function Home() {
  const toast = useContext(ToastContext);
  const today = useMemo(() => new Date(), []);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeStartDate, setActiveStartDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [calendarGroups, setCalendarGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadCalendar = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getMonthlyCalendar({
          year: activeStartDate.getFullYear(),
          month: activeStartDate.getMonth() + 1,
        });

        if (ignore) {
          return;
        }

        setCalendarGroups(response);
      } catch (loadError) {
        if (ignore) {
          return;
        }

        const message =
          loadError instanceof Error
            ? loadError.message
            : "월별 캘린더를 불러오지 못했습니다.";
        setError(message);
        toast?.push(message);
        setCalendarGroups([]);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadCalendar();

    return () => {
      ignore = true;
    };
  }, [activeStartDate, toast]);

  const dateEventCountMap = useMemo(() => {
    const counts = new Map();

    for (const group of calendarGroups) {
      for (const event of group.events) {
        const dateKey = formatDateKeyFromString(event.startTime);

        if (!dateKey) {
          continue;
        }

        counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1);
      }
    }

    return counts;
  }, [calendarGroups]);

  const selectedDateGroups = useMemo(() => {
    const selectedKey = formatDateKeyFromDate(selectedDate);

    return calendarGroups
      .map((group) => ({
        ...group,
        events: group.events
          .filter((event) => formatDateKeyFromString(event.startTime) === selectedKey)
          .sort(sortByStartTime),
      }))
      .filter((group) => group.events.length > 0);
  }, [calendarGroups, selectedDate]);

  const monthEvents = useMemo(
    () =>
      calendarGroups
        .flatMap((group, index) =>
          group.events.map((event) => ({
            ...event,
            badgeClass: clubBadgeStyles[index % clubBadgeStyles.length],
          })),
        )
        .sort(sortByStartTime),
    [calendarGroups],
  );

  const filteredMonthEvents = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) {
      return monthEvents;
    }

    return monthEvents.filter((event) =>
      [event.eventTitle, event.clubName, event.location]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [monthEvents, searchQuery]);

  const handleDateChange = (value) => {
    const nextDate = Array.isArray(value) ? value[0] : value;

    if (!(nextDate instanceof Date)) {
      return;
    }

    setSelectedDate(nextDate);

    if (
      nextDate.getFullYear() !== activeStartDate.getFullYear() ||
      nextDate.getMonth() !== activeStartDate.getMonth()
    ) {
      setActiveStartDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <div className="h-full overflow-y-auto px-4 pb-28 pt-4">
        <div className="rounded-[28px] border border-[#ece7f5] bg-white px-4 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#7c7c7c]">
                {formatMonthLabel(activeStartDate)}
              </p>
              <h1 className="mt-1 text-xl font-bold text-[#111111]">내 행사 캘린더</h1>
            </div>
            <div className="rounded-full bg-[#f4ebff] px-3 py-1 text-xs font-semibold text-[#702f95]">
              {monthEvents.length}개 일정
            </div>
          </div>

          <div className="mt-4">
            <Calendar
              value={selectedDate}
              activeStartDate={activeStartDate}
              onChange={handleDateChange}
              onActiveStartDateChange={({ activeStartDate: nextActiveStartDate }) => {
                if (nextActiveStartDate instanceof Date) {
                  setActiveStartDate(nextActiveStartDate);
                }
              }}
              className="h-full w-full custom-calendar"
              calendarType="gregory"
              tileContent={({ date, view }) =>
                view === "month" && dateEventCountMap.has(formatDateKeyFromDate(date)) ? (
                  <div className="mt-1 flex justify-center">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#702f95]" />
                  </div>
                ) : null
              }
            />
          </div>
        </div>

        <div className="my-6 px-3">
          <div className="h-px bg-gray-200" />
        </div>

        <div className="px-3 text-left">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-[#111111]">
                {formatSelectedDate(selectedDate)}
              </div>
              <p className="mt-1 text-sm text-[#808080]">
                선택한 날짜에 속한 행사만 요약합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full border border-[#e2d6f2] bg-[#faf7ff] px-4 py-2 text-sm font-medium text-[#702f95]"
            >
              월간 목록
            </button>
          </div>

          {isLoading ? (
            <div className="mt-5 rounded-2xl border border-[#ededed] bg-[#fcfcfc] px-4 py-5 text-sm text-[#666666]">
              월별 캘린더를 불러오는 중입니다.
            </div>
          ) : error ? (
            <div className="mt-5 rounded-2xl border border-[#fde0dd] bg-[#fff7f7] px-4 py-5">
              <p className="text-sm font-medium text-[#d93025]">{error}</p>
              <button
                type="button"
                onClick={() =>
                  setActiveStartDate(
                    new Date(
                      activeStartDate.getFullYear(),
                      activeStartDate.getMonth(),
                      1,
                    ),
                  )
                }
                className="mt-3 rounded-xl bg-[#111111] px-4 py-2 text-sm font-medium text-white"
              >
                다시 시도
              </button>
            </div>
          ) : selectedDateGroups.length > 0 ? (
            <div className="mt-5 space-y-4">
              {selectedDateGroups.map((group, groupIndex) => (
                <div key={group.clubId}>
                  <span
                    className={`inline-block rounded-md px-3 py-1 text-sm font-semibold ${clubBadgeStyles[groupIndex % clubBadgeStyles.length]}`}
                  >
                    {group.clubName}
                  </span>

                  <ul className="mt-2 ml-2 space-y-2 text-sm text-gray-700">
                    {group.events.map((event) => (
                      <li key={event.eventId} className="rounded-xl bg-[#fafafa] px-3 py-3">
                        <p className="font-semibold text-[#111111]">• {event.eventTitle}</p>
                        <p className="mt-1 text-xs text-[#6f6f6f]">
                          {formatEventTime(event.startTime)}
                        </p>
                        <p className="mt-1 text-xs text-[#9a9a9a]">
                          {event.location || "장소 미등록"}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-[#d9d9d9] bg-[#fcfcfc] px-4 py-5 text-sm text-[#666666]">
              선택한 날짜에는 표시할 행사가 없습니다.
            </div>
          )}
        </div>
      </div>

      {open ? (
        <div
          className="absolute inset-0 bg-black/20"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={`
          absolute bottom-0 left-0 w-full rounded-t-2xl bg-[#F4EBFF]
          transition-transform duration-300
          ${open ? "translate-y-0" : "translate-y-[64%]"}
        `}
        style={{ height: "70%" }}
      >
        <button
          type="button"
          className="mt-3 flex w-full justify-center"
          onClick={() => setOpen((current) => !current)}
        >
          <img src={chevronUp} alt="캘린더 목록 토글" />
        </button>

        <div className="px-4 pb-6 pt-2">
          <div className="rounded-2xl bg-white px-4 py-4">
            <h2 className="text-base font-bold text-[#111111]">이번 달 전체 행사</h2>
            <p className="mt-1 text-sm text-[#808080]">
              이번 묶음은 `/api/calendar` 월별 조회만 사용합니다.
            </p>
          </div>

          <div className="relative pt-4">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="이번 달 목록 내 검색"
              className="w-full rounded-full border border-purple-200 px-4 py-3 pr-12 text-sm focus:outline-none"
            />

            <img
              src={search}
              alt="search"
              className="absolute right-4 top-[31px] h-5 w-5 -translate-y-1/2"
            />
          </div>

          <div className="mt-3 inline-flex rounded-full border border-[#e2d6f2] bg-white px-3 py-1 text-xs font-semibold text-[#702f95]">
            {formatMonthLabel(activeStartDate)} 기준
          </div>

          <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pb-24">
            {!isLoading && filteredMonthEvents.length > 0 ? (
              filteredMonthEvents.map((event) => (
                <div
                  key={event.eventId}
                  className="rounded-xl border border-purple-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-800">
                        {event.eventTitle}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {event.clubName}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${event.badgeClass}`}
                    >
                      #{event.eventId}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between gap-4 text-xs text-gray-400">
                    <span>{event.location || "장소 미등록"}</span>
                    <span>{formatEventTime(event.startTime)}</span>
                  </div>
                </div>
              ))
            ) : !isLoading ? (
              <div className="rounded-xl border border-dashed border-[#d9d9d9] bg-white px-4 py-5 text-sm text-[#666666]">
                {searchQuery.trim()
                  ? "검색 조건에 맞는 일정이 없습니다."
                  : "이번 달에 표시할 일정이 없습니다."}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <BottomBar activeItem="home" />
    </div>
  );
}
