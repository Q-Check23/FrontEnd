import { useSearchParams } from "react-router-dom";
import BackHeader from "../../components/BackHeader";
import GroupTabs from "../../components/GroupTabs";
import NoticeCard from "./components/NoticeCard";

export default function GroupNotice() {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get("role") === "ADMIN";
  // TODO: API 연동 - 모임 정보 & 공지 목록 조회
  const clubName = "KUIT";
  const memberCount = 124;

  return (
    <div className="bg-surface h-full overflow-y-auto pb-24">
      <BackHeader title={clubName} subtitle={`멤버 ${memberCount}명`} />
      <GroupTabs activeTab="notice" />

      <main className="px-5 pt-6 space-y-3">
        {/* TODO: 실제 공지 데이터로 교체 */}
        <NoticeCard
          author="정윤아"
          isAdmin
          timeAgo="방금 전"
          title="KUIT 6기 데모데이"
          content="안녕하세요! 드디어 기다리고 기다리던 6기 데모데이가 다가왔습니다. 우리들의 노력이 결실을 맺는 소중한 자리에 모두 함께해주세요."
        />
        <NoticeCard
          author="김민수"
          isAdmin
          timeAgo="2시간 전"
          title="중간 회고 모임 공지"
          content="이번 프로젝트의 반환점을 돌아보며 서로의 진행 상황을 공유하고 피드백을 주고받는 시간을 가지려 합니다."
        />
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
