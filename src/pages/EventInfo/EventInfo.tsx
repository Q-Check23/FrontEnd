import { useNavigate, useSearchParams } from "react-router-dom";
import { useEventDetail, useEventRegistrations, useMyEventRegistration, useCancelRegistration } from "../../hooks";
import { useToastStore } from "../../stores/useToastStore";
import BackHeader from "../../components/BackHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";
import { parseKST } from "../../lib/datetime";

function isBeforeRegistrationCutoff(startTime?: string): boolean {
  if (!startTime) return false;
  const start = parseKST(startTime).getTime();
  if (isNaN(start)) return false;
  return Date.now() < start - 30 * 60 * 1000;
}

export default function EventInfo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get("eventId"));
  const { data: event, isLoading, isError, refetch } = useEventDetail(eventId);
  const { data: registrations = [] } = useEventRegistrations(eventId);
  const { data: myRegistration, refetch: refetchMyRegistration } = useMyEventRegistration(eventId);
  const cancelMutation = useCancelRegistration(eventId);
  const pushToast = useToastStore((state) => state.push);

  const isRegistered = myRegistration != null && myRegistration.status !== "CANCELED";
  const isCheckedIn = myRegistration?.status === "CHECKED_IN";
  const beforeCutoff = isBeforeRegistrationCutoff(event?.startTime);
  const participantCount = registrations.length;

  if (isLoading) {
    return (
      <div className="bg-surface h-full overflow-y-auto pb-32">
        <BackHeader title="행사 상세 정보" />
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-surface h-full overflow-y-auto pb-32">
        <BackHeader title="행사 상세 정보" />
        <ErrorFallback onRetry={refetch} />
      </div>
    );
  }

  function renderActionButton() {
    if (!isRegistered && !beforeCutoff) {
      // 미등록 + 30분 이내 → 입장하기
      return (
        <button
          onClick={() => navigate(`/qrcheck-in?eventId=${eventId}`)}
          className="flex-[2] h-14 bg-gradient-to-br from-primary-container to-primary text-white rounded-xl text-xl font-semibold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            qr_code_2
          </span>
          입장하기
        </button>
      );
    }

    if (!isRegistered) {
      // 미등록 + 30분 이상 남음 → 사전 등록하기
      return (
        <button
          onClick={() => navigate(`/register?eventId=${eventId}`)}
          className="flex-[2] h-14 bg-gradient-to-br from-primary-container to-primary text-white rounded-xl text-xl font-semibold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            how_to_reg
          </span>
          사전 등록하기
        </button>
      );
    }

    if (beforeCutoff) {
      // 등록 완료 + 30분 이상 남음 → 등록 취소
      return (
        <button
          onClick={() => {
            if (!window.confirm("등록을 취소하시겠습니까?")) return;
            cancelMutation.mutate(undefined, {
              onSuccess: () => {
                pushToast("등록이 취소되었어요");
                refetchMyRegistration();
              },
              onError: (error) => {
                pushToast(error instanceof Error ? error.message : "취소에 실패했어요");
              },
            });
          }}
          disabled={cancelMutation.isPending}
          className="flex-[2] h-14 border-2 border-primary text-primary rounded-xl text-xl font-semibold active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span className="material-symbols-outlined">person_remove</span>
          {cancelMutation.isPending ? "취소 중..." : "등록 취소"}
        </button>
      );
    }

    // 등록 완료 + 30분 이내 → 입장하기
    return (
      <button
        onClick={() => navigate(`/qrcheck-in?eventId=${eventId}`)}
        className="flex-[2] h-14 bg-gradient-to-br from-primary-container to-primary text-white rounded-xl text-xl font-semibold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          qr_code_2
        </span>
        입장하기
      </button>
    );
  }

  return (
    <div className="bg-surface h-full overflow-y-auto pb-32">
      <BackHeader title="행사 상세 정보" />

      <main>
        {/* Hero Section */}
        <section className="px-5 pt-8 pb-12">
          <span className="inline-block px-3 py-1 bg-gradient-to-br from-primary-container to-primary text-white text-xs font-semibold rounded-full mb-3 shadow-lg">
            D-DAY
          </span>
          <h2 className="text-2xl font-bold leading-tight mb-2">
            {event?.title ?? "-"}
          </h2>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">
              groups
            </span>
            <p className="text-xs font-semibold">{participantCount}명 참여 중</p>
          </div>
        </section>

        {/* Key Info Chips */}
        <section className="px-5">
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px]">
                  calendar_today
                </span>
                <span className="text-xs font-semibold">날짜</span>
              </div>
              <p className="text-base font-bold">
                {formatDate(event?.startTime)}
              </p>
              <p className="text-xs font-semibold text-on-surface-variant">
                {formatTime(event?.startTime)} 시작
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px]">
                  location_on
                </span>
                <span className="text-xs font-semibold">장소</span>
              </div>
              <p className="text-base font-bold">
                {event?.location || "-"}
              </p>
              <p className="text-xs font-semibold text-on-surface-variant underline cursor-pointer">
                지도 보기
              </p>
            </div>
          </div>
        </section>

        {/* Details Section */}
        {event?.description && (
          <section className="px-5 mt-6">
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
              <h3 className="text-xl font-semibold mb-3">상세 내용</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Bottom Actions */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md p-5 shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex gap-3">
        {isCheckedIn ? (
          <button
            onClick={() =>
              navigate(
                event ? `/group-events?clubId=${event.clubId}` : "/home",
                { replace: true },
              )
            }
            className="flex-1 h-14 bg-gradient-to-br from-primary-container to-primary text-white rounded-xl text-xl font-semibold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            입장 완료
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                if (!isRegistered) {
                  navigate(-1);
                  return;
                }
                if (!window.confirm("불참 처리하시겠습니까? 등록이 취소됩니다.")) return;
                cancelMutation.mutate(undefined, {
                  onSuccess: () => {
                    pushToast("불참 처리되었어요");
                    navigate(-1);
                  },
                  onError: (error) => {
                    pushToast(error instanceof Error ? error.message : "불참 처리에 실패했어요");
                  },
                });
              }}
              disabled={cancelMutation.isPending}
              className="flex-1 h-14 border-2 border-outline rounded-xl text-xl font-semibold text-on-surface-variant active:scale-95 transition-all disabled:opacity-50"
            >
              불참
            </button>
            {renderActionButton()}
          </>
        )}
      </footer>
    </div>
  );
}

function formatDate(startTime?: string) {
  if (!startTime) return "-";
  try {
    const d = parseKST(startTime);
    if (!isNaN(d.getTime())) {
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
      return `${mm}월 ${dd}일 (${weekdays[d.getDay()]})`;
    }
  } catch {
    // fallback
  }
  return startTime;
}

function formatTime(startTime?: string) {
  if (!startTime) return "-";
  try {
    const d = parseKST(startTime);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  } catch {
    // fallback
  }
  return "";
}
