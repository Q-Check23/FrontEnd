import { useSearchParams } from "react-router-dom";
import { useNotices } from "../../hooks";
import BackHeader from "../../components/BackHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";

function formatDateTime(dateString: string) {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  } catch {
    return dateString;
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
    <div className="bg-surface h-full overflow-y-auto">
      <BackHeader title="공지 상세" />

      <main className="px-5 pt-6 pb-12">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold text-on-surface">
              {notice.authorName}
            </span>
            {notice.authorRole !== "MEMBER" && (
              <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary text-[10px] font-bold rounded-full uppercase tracking-wider">
                운영진
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-on-surface mb-2">
            {notice.title}
          </h2>

          <p className="text-xs text-on-surface-variant/60 mb-6">
            {formatDateTime(notice.createdAt)}
          </p>

          <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
            {notice.content}
          </p>
        </div>
      </main>
    </div>
  );
}
