import { useNavigate, useSearchParams } from "react-router-dom";
import { useEventDetail } from "../../hooks";
import BackHeader from "../../components/BackHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";

export default function EventInfo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get("eventId"));
  const { data: event, isLoading, isError, refetch } = useEventDetail(eventId);

  // TODO: API 연동 - 참가 인원 수 조회
  const participantCount = 42;

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
        <section className="px-5 mt-6 space-y-3">
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
            <h3 className="text-xl font-semibold mb-3">상세 내용</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              KUIT의 한 학기를 마무리하는 정기 데모데이입니다. 각 팀별 프로젝트
              결과물을 공유하고, 현직자 멘토들과의 심도 있는 네트워킹 시간이
              준비되어 있습니다.
            </p>
            <h4 className="text-xs font-semibold text-primary mb-3">준비물</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>개인 노트북 및 충전기</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>팀별 발표 자료 (USB 지참 권장)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>명함 또는 링크드인 QR</span>
              </li>
            </ul>
          </div>

          {/* Host Info */}
          <div className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between border border-outline-variant/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant">
                  groups
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface-variant">
                  주최
                </p>
                <p className="text-sm font-bold">KUIT 운영진</p>
              </div>
            </div>
            <button className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline">
              프로필 보기
              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Actions */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md p-5 shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 h-14 border-2 border-outline rounded-xl text-xl font-semibold text-on-surface-variant active:scale-95 transition-all"
        >
          불참
        </button>
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
          입장 QR코드 보기
        </button>
      </footer>
    </div>
  );
}

function formatDate(startTime?: string) {
  if (!startTime) return "-";
  try {
    const d = new Date(startTime);
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
    const d = new Date(startTime);
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
