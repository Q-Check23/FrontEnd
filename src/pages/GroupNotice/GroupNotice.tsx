import { useSearchParams } from "react-router-dom";
import BackHeader from "../../components/BackHeader";
import GroupTabs from "../../components/GroupTabs";
import NoticeCard from "./components/NoticeCard";
import { useClubMembers, useMyClubs, useNotices } from "../../hooks";

function formatTimeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function GroupNotice() {
  const [searchParams] = useSearchParams();
  const clubId = Number(searchParams.get("clubId"));
  const role = searchParams.get("role");
  const isAdmin = role === "ADMIN" || role === "OWNER";

  const { data: clubs = [] } = useMyClubs();
  const { data: members = [] } = useClubMembers(clubId);
  const { data: notices = [] } = useNotices(clubId);
  const currentClub = clubs.find((club) => club.clubId === clubId);
  const clubName = currentClub?.clubName ?? "";
  const memberCount = members.length;

  return (
    <div className="bg-surface h-full overflow-y-auto pb-24">
      <BackHeader title={clubName} subtitle={`멤버 ${memberCount}명`} />
      <GroupTabs activeTab="notice" />

      <main className="px-5 pt-6 space-y-3">
        {notices.length === 0 ? (
          <p className="text-center text-on-surface-variant py-12">
            등록된 공지가 없습니다.
          </p>
        ) : (
          notices.map((notice) => (
            <NoticeCard
              key={notice.noticeId}
              author={notice.authorName}
              isAdmin={notice.authorRole !== "MEMBER"}
              timeAgo={formatTimeAgo(notice.createdAt)}
              title={notice.title}
              content={notice.content}
            />
          ))
        )}
      </main>

      {/* FAB - 공지 작성 (운영자 전용) */}
      {isAdmin && (
        <button className="fixed right-6 bottom-6 w-14 h-14 bg-gradient-to-br from-primary to-secondary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform z-50">
          <span className="material-symbols-outlined">edit</span>
        </button>
      )}
    </div>
  );
}
