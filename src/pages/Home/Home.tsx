import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type CalendarEvent } from "../../api/calendar";
import { useMonthlyCalendar } from "../../hooks";
import TopAppBar from "./components/TopAppBar";
import Calendar from "./components/Calendar";
import ScheduleList from "./components/ScheduleList";
import BottomSheet from "./components/BottomSheet";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";
import { parseKST } from "../../lib/datetime";

export default function Home() {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: clubGroups = [], isLoading, isError, refetch } = useMonthlyCalendar(year, month);

  const allEvents = useMemo(
    () => clubGroups.flatMap((g) => g.events),
    [clubGroups],
  );

  const eventDates = useMemo(() => {
    const dates = new Set<number>();
    for (const event of allEvents) {
      if (event.startTime) {
        const d = parseKST(event.startTime);
        if (
          d.getFullYear() === year &&
          d.getMonth() + 1 === month
        ) {
          dates.add(d.getDate());
        }
      }
    }
    return Array.from(dates);
  }, [allEvents, year, month]);

  const selectedEvents = useMemo(() => {
    if (selectedDate === null) return [];
    return allEvents.filter((event) => {
      if (!event.startTime) return false;
      const d = parseKST(event.startTime);
      return (
        d.getFullYear() === year &&
        d.getMonth() + 1 === month &&
        d.getDate() === selectedDate
      );
    });
  }, [allEvents, year, month, selectedDate]);

  const handlePrevMonth = useCallback(() => {
    setMonth((prev) => {
      if (prev === 1) {
        setYear((y) => y - 1);
        return 12;
      }
      return prev - 1;
    });
    setSelectedDate(null);
  }, []);

  const handleNextMonth = useCallback(() => {
    setMonth((prev) => {
      if (prev === 12) {
        setYear((y) => y + 1);
        return 1;
      }
      return prev + 1;
    });
    setSelectedDate(null);
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    navigate(`/event-info?eventId=${event.eventId}`);
  }, [navigate]);

  return (
    <>
      <TopAppBar />
      <main
        className={`pt-20 pb-32 px-5 transition-all ${
          sheetOpen ? "opacity-30 pointer-events-none blur-[2px]" : ""
        }`}
      >
        <Calendar
          year={year}
          month={month}
          selectedDate={selectedDate}
          eventDates={eventDates}
          onSelectDate={setSelectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {isLoading && <LoadingSpinner />}
        {isError && <ErrorFallback onRetry={refetch} />}

        {!isLoading && !isError && selectedDate !== null && (
          <ScheduleList
            year={year}
            month={month}
            day={selectedDate}
            events={selectedEvents}
            onEventClick={handleEventClick}
          />
        )}
      </main>
      <BottomSheet
        open={sheetOpen}
        onOpen={() => setSheetOpen(true)}
        onClose={() => setSheetOpen(false)}
        onEventClick={handleEventClick}
      />
    </>
  );
}
