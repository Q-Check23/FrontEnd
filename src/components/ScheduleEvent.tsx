import { useState } from "react";
import ElementTitle from "./ElementTitle";

const calendarIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Crect x='3' y='4' width='18' height='18' rx='2'/%3E%3Cline x1='16' y1='2' x2='16' y2='6'/%3E%3Cline x1='8' y1='2' x2='8' y2='6'/%3E%3Cline x1='3' y1='10' x2='21' y2='10'/%3E%3C/svg%3E";
const clockIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpolyline points='12 6 12 12 16 14'/%3E%3C/svg%3E";

interface ScheduleEventProps {
  date?: string;
  time?: string;
  onDateChange?: (date: string) => void;
  onTimeChange?: (time: string) => void;
}

export default function ScheduleEvent({
  date = "2025. 12. 03.",
  time = "오후 07:00",
  onDateChange,
  onTimeChange,
}: ScheduleEventProps) {
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedTime, setSelectedTime] = useState(time);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setSelectedTime(newTime);
    onTimeChange?.(newTime);
  };

  return (
    <div className="flex flex-col w-full gap-[2px]">
      {/* Title */}
      <ElementTitle title="일시" />

      {/* Date and Time Container */}
      <div className="flex items-start justify-between w-full gap-[8px]">
        {/* Date Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full h-12 px-[13px] py-[7px] bg-[#fdfdfd] border border-[#d5d5d5] rounded-lg text-[#404040] text-ui14 font-medium text-center appearance-none pr-10"
            placeholder="날짜"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#404040] pointer-events-none flex items-center justify-center">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>

        {/* Time Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={selectedTime}
            onChange={handleTimeChange}
            className="w-full h-12 px-[13px] py-[7px] bg-[#fdfdfd] border border-[#d5d5d5] rounded-lg text-[#404040] text-ui14 font-medium text-center appearance-none pr-10"
            placeholder="시간"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#404040] pointer-events-none flex items-center justify-center">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
