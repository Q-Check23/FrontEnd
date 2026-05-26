import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BackHeader from "../../components/BackHeader";
import GroupTabs from "../../components/GroupTabs";
import NoticeCard from "./components/NoticeCard";
import { useClubMembers, useMyClubs, useNotices, useCreateNotice } from "../../hooks";

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
  const navigate = useNavigate();
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

  const [showForm, setShowForm] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const createNoticeMutation = useCreateNotice(clubId);

  function handleCreateNotice() {
    if (!noticeTitle.trim() || !noticeContent.trim()) return;
    createNoticeMutation.mutate(
      { title: noticeTitle.trim(), content: noticeContent.trim() },
      {
        onSuccess: () => {
          setNoticeTitle("");
          setNoticeContent("");
          setShowForm(false);
        },
      },
    );
  }

  return (
    <div className="bg-surface h-full overflow-y-auto pb-24">
      <BackHeader
        title={clubName}
        subtitle={`멤버 ${memberCount}명`}
        backTo="/meeting"
        rightSlot={
          isAdmin ? (
            <button
              onClick={() => navigate(`/club-settings?clubId=${clubId}`)}
              className="material-symbols-outlined text-on-surface-variant p-1 active:scale-95 transition-transform"
            >
              settings
            </button>
          ) : undefined
        }
      />
      <GroupTabs activeTab="notice" />

      <main className="px-5 pt-6 space-y-3">
        {notices.length === 0 && !showForm ? (
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
              onClick={() => navigate(`/notice-detail?clubId=${clubId}&noticeId=${notice.noticeId}`)}
            />
          ))
        )}
      </main>

      {/* 공지 작성 모달 */}
      {showForm && (
        <>
          <div
            className="fixed inset-0 bg-on-surface/40 z-[60] backdrop-blur-[2px]"
            onClick={() => setShowForm(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-[70] bg-surface rounded-t-[24px] shadow-[0px_-8px_40px_rgba(0,0,0,0.12)] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">공지 작성</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-on-surface-variant"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="공지 제목"
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <textarea
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                placeholder="공지 내용을 입력하세요"
                rows={5}
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              />
              <button
                onClick={handleCreateNotice}
                disabled={createNoticeMutation.isPending || !noticeTitle.trim() || !noticeContent.trim()}
                className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-3 rounded-xl text-base font-semibold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                {createNoticeMutation.isPending ? "등록 중..." : "공지 등록"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* FAB - 공지 작성 (운영자 전용) */}
      {isAdmin && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed right-6 bottom-6 w-14 h-14 bg-gradient-to-br from-primary to-secondary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform z-50"
        >
          <span className="material-symbols-outlined">edit</span>
        </button>
      )}
    </div>
  );
}
