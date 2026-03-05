import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomBar from "../../components/BottomBar";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time?: string;
  badge?: {
    text: string;
    color: "green" | "orange" | "gray";
  };
  attendanceRate: number;
  stats: {
    label: string;
    value: string;
    subLabel?: string;
    subValue?: string;
  }[];
  showDetailLink?: boolean;
  onDetailClick?: () => void;
}

const EventCard = ({
  title,
  date,
  time,
  badge,
  attendanceRate,
  stats,
  showDetailLink = true,
  onDetailClick,
}: EventCardProps) => {
  const getBadgeColors = (color: string) => {
    switch (color) {
      case "green":
        return "bg-[#00c853] text-white";
      case "orange":
        return "bg-[#ff9800] text-white";
      case "gray":
        return "bg-[#808080] text-white";
      default:
        return "bg-[#00c853] text-white";
    }
  };

  const CircleProgress = ({ percentage }: { percentage: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg width="96" height="96" className="transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="6"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#702f95"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-2xl font-bold text-black">{percentage}%</p>
          <p className="text-xs text-[#808080]">입장율</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-5 mb-4 border border-[#f0f0f0]">
      {/* Header with Title and Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black mb-1">{title}</h3>
          <div className="flex items-center gap-1 text-sm text-[#808080]">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {date}
          </div>
        </div>
        {badge && (
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColors(
              badge.color
            )}`}
          >
            {badge.text}
          </div>
        )}
      </div>

      {/* Time */}
      {time && (
        <div className="flex items-center gap-1 text-sm text-[#606060] mb-4">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {time}
        </div>
      )}

      {/* Content */}
      <div className="flex gap-6 mb-4">
        {/* Progress Circle */}
        <div className="flex-shrink-0">
          <CircleProgress percentage={attendanceRate} />
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-xs text-[#808080] mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-black">{stat.value}</p>
              {stat.subLabel && (
                <>
                  <p className="text-xs text-[#808080] mt-2">{stat.subLabel}</p>
                  <p className="text-lg font-bold text-black">{stat.subValue}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Link */}
      {showDetailLink && (
        <button
          onClick={onDetailClick}
          className="text-[#702f95] text-sm font-bold hover:underline"
        >
          상세 현황 보기 &gt;
        </button>
      )}
    </div>
  );
};

const DetailEventCard = ({
  title,
  date,
  completionRate,
  stats,
  status,
  onReportClick,
}: {
  title: string;
  date: string;
  completionRate: number;
  stats: {
    label: string;
    value: string;
    subLabel?: string;
    subValue?: string;
  }[];
  status: {
    text: string;
    color: "green" | "orange" | "gray";
  };
  onReportClick?: () => void;
}) => {
  const StatusIndicator = ({ color }: { color: string }) => {
    const colors: Record<string, string> = {
      green: "text-[#00c853]",
      orange: "text-[#ff9800]",
      gray: "text-[#808080]",
    };
    return <span className={`font-bold ${colors[color]}`}>{status.text}</span>;
  };

  const CircleProgress = ({ percentage }: { percentage: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg width="96" height="96" className="transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="6"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="#808080"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-2xl font-bold text-black">{percentage}%</p>
          <p className="text-xs text-[#808080]">최중</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-5 border border-[#f0f0f0]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-black mb-1">{title}</h3>
          <p className="text-sm text-[#808080]">{date}</p>
        </div>
        <div className="px-3 py-1 bg-[#f0f0f0] rounded-full text-xs font-bold text-[#080808]">
          종료
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-6 mb-4">
        {/* Progress Circle */}
        <div className="flex-shrink-0">
          <CircleProgress percentage={completionRate} />
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-3">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-xs text-[#808080] mb-1">{stat.label}</p>
              <p className="text-base font-bold text-black">{stat.value}</p>
            </div>
          ))}
          <div>
            <p className="text-xs text-[#808080] mb-1">정상 현황</p>
            <StatusIndicator color={status.color} />
          </div>
        </div>
      </div>

      {/* Report Link */}
      <button
        onClick={onReportClick}
        className="text-[#702f95] text-sm font-bold hover:underline"
      >
        결과 리포트 보기 &gt;
      </button>
    </div>
  );
};

export default function EventManage() {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);

  const handleDetailClick = (eventId: string) => {
    navigate("/event-info");
  };

  const handleReportClick = (eventId: string) => {
    navigate("/event-analysis");
  };

  return (
    <div className="relative w-full h-full bg-[#f9f9f9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-[#f0f0f0]">
        <div>
          <h1 className="text-2xl font-bold text-black">모임 관리</h1>
          <p className="text-sm text-[#808080]">2025년 12월 03일 (수)</p>
        </div>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="px-3 py-2 border border-[#e0e0e0] rounded-lg text-sm font-medium text-black hover:bg-[#f9f9f9] transition-colors"
        >
          ▼ 필터
        </button>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28">
        {/* KUIT 6기 데모데이 */}
        <EventCard
          id="event1"
          title="KUIT 6기 데모데이"
          date="12월 03일 (수)"
          time="오후 19:00 - 22:00"
          badge={{ text: "LIVE", color: "green" }}
          attendanceRate={85}
          stats={[
            {
              label: "총 실청 입장",
              value: "40명",
              subLabel: "미입장 (No-show)",
              subValue: "6명",
            },
            {
              label: "현재 입장",
              value: "34명",
              subLabel: "추기 등록",
              subValue: "+2명",
            },
          ]}
          onDetailClick={() => handleDetailClick("event1")}
        />

        {/* 서버 아키텍처 스터디 */}
        <EventCard
          id="event2"
          title="서버 아키텍처 스터디"
          date="12월 10일 (수)"
          time="오후 19:00"
          badge={{ text: "D-7", color: "orange" }}
          attendanceRate={66}
          stats={[
            {
              label: "모집 정원",
              value: "12명",
              subLabel: "신청 완료",
              subValue: "8명",
            },
          ]}
          onDetailClick={() => handleDetailClick("event2")}
        />

        {/* 11월 정기 회식 - Detail View */}
        <DetailEventCard
          title="11월 정기 회식"
          date="11월 20일 종료"
          completionRate={92}
          stats={[
            {
              label: "대사 인원",
              value: "25명",
            },
          ]}
          status={{ text: "완료", color: "green" }}
          onReportClick={() => handleReportClick("event3")}
        />
      </div>

      {/* Bottom Navigation */}
      <BottomBar activeItem="home" />
    </div>
  );
}
