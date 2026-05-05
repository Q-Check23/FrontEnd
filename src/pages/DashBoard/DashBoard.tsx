import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyClubs, type ClubSummary } from "../../api/clubs";
import { getEvents, type EventListPage } from "../../api/events";
import BottomBar from "../../components/BottomBar";
import EventManageTabs from "../../components/EventManageTabs";
import { ToastContext } from "../../context/ToastContext";

type ToastValue = {
  push: (message: string) => void;
};

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="flex-1 rounded-2xl border border-[#e7e7e7] bg-white px-4 py-4">
      <p className="text-sm font-medium text-[#666666]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#111111]">{value}</p>
      <p className="mt-1 text-xs text-[#9a9a9a]">{helper}</p>
    </div>
  );
}

function ClubCard({ club }: { club: ClubSummary }) {
  return (
    <div className="rounded-2xl border border-[#e9e9e9] bg-white px-4 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-[#111111]">
            {club.clubName}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#666666]">
            {club.clubDescription || "등록된 클럽 설명이 없습니다."}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#f0ebfa] px-3 py-1 text-xs font-semibold text-[#702f95]">
          {club.myRole}
        </span>
      </div>
      <p className="mt-3 text-xs text-[#9a9a9a]">Club ID {club.clubId}</p>
    </div>
  );
}

function formatStartTime(value: string) {
  if (!value) {
    return "일시 미정";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function EventCard({
  event,
  onClick,
}: {
  event: EventListPage["items"][number];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-[#e9e9e9] bg-white px-4 py-4 text-left shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-[#111111]">
            {event.title}
          </p>
          <p className="mt-2 text-sm font-medium text-[#4f4f4f]">
            {formatStartTime(event.startTime)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            event.isActive
              ? "bg-[#e8f7ee] text-[#0a8f4d]"
              : "bg-[#f1f1f1] text-[#777777]"
          }`}
        >
          {event.isActive ? "진행 중" : "비활성"}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[#666666]">
        <span className="truncate">
          {event.location || "장소 미등록"}
        </span>
        <span className="shrink-0 text-xs text-[#9a9a9a]">
          Event ID {event.eventId}
        </span>
      </div>
    </button>
  );
}

export default function DashBoard() {
  const navigate = useNavigate();
  const toast = useContext(ToastContext) as ToastValue | null;
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [eventPage, setEventPage] = useState<EventListPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [nextClubs, nextEvents] = await Promise.all([
        getMyClubs(),
        getEvents({ page: 0, size: 10 }),
      ]);

      setClubs(nextClubs);
      setEventPage(nextEvents);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "대시보드 데이터를 불러오지 못했습니다.";
      setError(message);
      toast?.push(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const totalEvents = eventPage?.totalElements ?? 0;
  const loadedEventCount = eventPage?.items.length ?? 0;

  return (
    <div className="relative flex h-full w-full flex-col bg-white">
      <div className="border-b border-[#f0f0f0] bg-white px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#111111]">대시보드</h1>
            <p className="mt-2 text-sm text-[#808080]">
              내 클럽과 최근 이벤트를 먼저 조회하도록 구성했습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="rounded-xl border border-[#d9d9d9] px-3 py-2 text-sm font-medium text-[#111111]"
          >
            새로고침
          </button>
        </div>
      </div>

      <EventManageTabs activeTab="dashboard" />

      <div className="flex-1 overflow-y-auto bg-[#f7f7f7] px-4 py-4 pb-24">
        {isLoading ? (
          <div className="rounded-3xl bg-white px-5 py-6 text-sm text-[#666666] shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            대시보드 데이터를 불러오는 중입니다.
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-white px-5 py-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <p className="text-sm font-medium text-[#d93025]">{error}</p>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="mt-4 rounded-xl bg-[#111111] px-4 py-2 text-sm font-medium text-white"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex gap-3">
              <StatCard
                label="내 클럽"
                value={clubs.length}
                helper="현재 가입된 클럽 수"
              />
              <StatCard
                label="전체 이벤트"
                value={totalEvents}
                helper="백엔드 목록 기준"
              />
              <StatCard
                label="불러온 이벤트"
                value={loadedEventCount}
                helper="현재 페이지 기준"
              />
            </div>

            <section className="flex flex-col gap-3">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#111111]">내 클럽</h2>
                  <p className="mt-1 text-sm text-[#808080]">
                    `/api/clubs` 결과를 그대로 표시합니다.
                  </p>
                </div>
              </div>

              {clubs.length > 0 ? (
                clubs.map((club) => <ClubCard key={club.clubId} club={club} />)
              ) : (
                <div className="rounded-2xl border border-dashed border-[#d9d9d9] bg-white px-4 py-5 text-sm text-[#666666]">
                  속한 클럽이 없습니다.
                </div>
              )}
            </section>

            <section className="flex flex-col gap-3">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#111111]">
                    최근 이벤트
                  </h2>
                  <p className="mt-1 text-sm text-[#808080]">
                    총 {totalEvents}개 중 최근 {loadedEventCount}개를 보여줍니다.
                  </p>
                </div>
              </div>

              {eventPage && eventPage.items.length > 0 ? (
                eventPage.items.map((event) => (
                  <EventCard
                    key={event.eventId}
                    event={event}
                    onClick={() => navigate(`/event-info?eventId=${event.eventId}`)}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#d9d9d9] bg-white px-4 py-5 text-sm text-[#666666]">
                  조회된 이벤트가 없습니다.
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      <BottomBar activeItem="activity" />
    </div>
  );
}
