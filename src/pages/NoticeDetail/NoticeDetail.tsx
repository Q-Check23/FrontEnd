import { useSearchParams } from "react-router-dom";
import { useNotices } from "../../hooks";
import BackHeader from "../../components/BackHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";

function formatDate(dateString: string) {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    return `${mm}월 ${dd}일 (${weekdays[d.getDay()]})`;
  } catch {
    return dateString;
  }
}

function formatTime(dateString: string) {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

export default function NoticeDetail() {
  const [searchParams] = useSearchParams();
  const clubId = Number(searchParams.get("clubId"));
  const noticeId = Number(searchParams.get("noticeId"));
  const { data: notices = [], isLoading, isError, refetch } = useNotices(clubId);

  const notice = notices.find((n) => n.noticeId === noticeId);

  if (isLoading) {
    return (
      <div className="bg-surface h-full overflow-y-auto">
        <BackHeader title="공지 상세" />
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-surface h-full overflow-y-auto">
        <BackHeader title="공지 상세" />
        <ErrorFallback onRetry={refetch} />
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="bg-surface h-full overflow-y-auto">
        <BackHeader title="공지 상세" />
        <p className="text-center text-on-surface-variant py-12">
          공지를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface h-full overflow-y-auto pb-12">
      <BackHeader title="공지 상세" />

      <main>
        {/* Hero Section */}
        <section className="px-5 pt-8 pb-12">
          <span className="inline-block px-3 py-1 bg-gradient-to-br from-primary-container to-primary text-white text-xs font-semibold rounded-full mb-3 shadow-lg">
            공지
          </span>
          <h2 className="text-2xl font-bold leading-tight mb-2">
            {notice.title}
          </h2>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="text-sm font-semibold">{notice.authorName}</span>
            {notice.authorRole !== "MEMBER" && (
              <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary text-[10px] font-bold rounded-full uppercase tracking-wider">
                운영진
              </span>
            )}
          </div>
        </section>

        {/* Key Info Card */}
        <section className="px-5">
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px]">
                  calendar_today
                </span>
                <span className="text-xs font-semibold">작성일</span>
              </div>
              <p className="text-base font-bold">
                {formatDate(notice.createdAt)}
              </p>
              <p className="text-xs font-semibold text-on-surface-variant">
                {formatTime(notice.createdAt)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px]">
                  person
                </span>
                <span className="text-xs font-semibold">작성자</span>
              </div>
              <p className="text-base font-bold">{notice.authorName}</p>
              <p className="text-xs font-semibold text-on-surface-variant">
                {notice.authorRole === "MEMBER" ? "멤버" : "운영진"}
              </p>
            </div>
          </div>
        </section>

        {/* Details Section */}
        {notice.content && (
          <section className="px-5 mt-6">
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
              <h3 className="text-xl font-semibold mb-3">상세 내용</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                {notice.content}
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
