import { useNavigate, useSearchParams } from "react-router-dom";
import { useEventDetail, useEventRegistrations, useMyClubs } from "../../hooks";
import BackHeader from "../../components/BackHeader";
import EventManageTabs from "../../components/EventManageTabs";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";

export default function DashBoard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = Number(searchParams.get("eventId"));
  const { data: event, isLoading, isError, refetch } = useEventDetail(eventId);
  const { data: registrations = [] } = useEventRegistrations(eventId);
  const { data: clubs = [] } = useMyClubs();
  const currentClub = event ? clubs.find((c) => c.clubId === event.clubId) : undefined;
  const backTo = event ? `/group-events?clubId=${event.clubId}&role=${currentClub?.myRole ?? "MEMBER"}` : undefined;

  const checkedInCount = registrations.filter(
    (r) => r.status === "CHECKED_IN",
  ).length;
  const dashStats = {
    totalRegistrations: registrations.length,
    checkedIn: checkedInCount,
    lastCheckIn: "-",
  };

  if (isLoading) {
    return (
      <div className="bg-surface h-full overflow-y-auto">
        <BackHeader
          title="행사 상세 설정"
          backTo={backTo}
        />
        <EventManageTabs activeTab="dashboard" />
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-surface h-full overflow-y-auto">
        <BackHeader
          title="행사 상세 설정"
          backTo={backTo}
        />
        <EventManageTabs activeTab="dashboard" />
        <ErrorFallback onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="bg-surface h-full overflow-y-auto">
      <BackHeader
        title="행사 상세 설정"
        backTo={backTo}
      />
      <EventManageTabs activeTab="dashboard" />

      <main className="p-5 space-y-6 pb-24">
        {/* 실시간 입장 현황 */}
        <section>
          <div className="relative bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant/20">
            <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </span>
                <h3 className="text-xl font-semibold">실시간 입장 현황</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-on-surface-variant">
                  현재 입장
                </span>
                <span className="text-primary font-bold text-xl">{dashStats.checkedIn}</span>
              </div>
            </div>

            {/* 통계 요약 */}
            <div className="grid grid-cols-2 divide-x divide-outline-variant/10 bg-surface-container-low/30">
              <div className="p-4">
                <span className="text-xs font-semibold text-on-surface-variant block mb-1">
                  총 등록 수
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-on-surface">{dashStats.totalRegistrations}</span>
                  <span className="text-xs font-semibold text-on-surface-variant">
                    명
                  </span>
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-on-surface-variant block mb-1">
                  실제 입장 수
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-secondary">{dashStats.checkedIn}</span>
                  <span className="text-xs font-semibold text-on-surface-variant">
                    명
                  </span>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-surface-container-lowest flex justify-between items-center border-t border-outline-variant/10">
              <p className="text-xs text-on-surface-variant">
                최근 입장: {dashStats.lastCheckIn}
              </p>
              <button className="text-primary text-xs font-bold flex items-center gap-1">
                상세보기
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* 행사 정보 */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold px-1">행사 정보 확인 및 수정</h3>
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant/20">
            <InfoRow
              label="설명:"
              value={event?.title ?? "-"}
              icon="edit"
              onClick={() => navigate(`/edit-event?eventId=${eventId}`)}
            />
            <InfoRow
              label="장소:"
              value={event?.location ?? "-"}
              icon="edit"
              valueIcon="location_on"
              onClick={() => navigate(`/edit-event?eventId=${eventId}`)}
            />
            <InfoRow
              label="시간:"
              value={event?.startTime ? formatDateTime(event.startTime) : "-"}
              icon="edit"
              onClick={() => navigate(`/edit-event?eventId=${eventId}`)}
            />
            <InfoRow
              label="인원 수:"
              value={`${registrations.length}명`}
              icon="group"
              isLast
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
  valueIcon,
  isLast,
  onClick,
}: {
  label: string;
  value: string;
  icon: string;
  valueIcon?: string;
  isLast?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`flex items-center p-4 ${
        isLast ? "" : "border-b border-outline-variant/10"
      }`}
    >
      <div className="w-24 shrink-0 text-on-surface-variant text-xs font-semibold">
        {label}
      </div>
      <div className="flex-1 text-on-surface text-sm flex items-center gap-1">
        {valueIcon && (
          <span className="material-symbols-outlined text-primary text-[18px]">
            {valueIcon}
          </span>
        )}
        {value}
      </div>
      <button
        onClick={onClick}
        className="material-symbols-outlined text-outline text-[20px] ml-2 active:scale-95 transition-transform"
      >
        {icon}
      </button>
    </div>
  );
}

function formatDateTime(startTime: string) {
  try {
    const d = new Date(startTime);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
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
