import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useClubMembers,
  useClubRole,
  useDiscordBotInviteUrl,
  useEvents,
  useMyClubs,
} from "../../hooks";
import BackHeader from "../../components/BackHeader";
import EventCard from "./components/EventCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";

export default function GroupEvents() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clubIdParam = searchParams.get("clubId");
  const clubId = Number(clubIdParam);
  const { isAdmin } = useClubRole(clubId);
  const { data, isLoading, isError, refetch } = useEvents({ clubId });
  const { data: clubs = [] } = useMyClubs();
  const { data: members = [] } = useClubMembers(clubId);
  const { data: botInviteUrl } = useDiscordBotInviteUrl();
  const [query, setQuery] = useState("");

  const currentClub = clubs.find((club) => club.clubId === clubId);
  const clubName = currentClub?.clubName ?? "";
  const memberCount = members.length;

  const events = data?.items ?? [];

  const filtered = query.trim()
    ? events.filter((e) =>
        e.title.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : events;

  return (
    <div className="bg-surface h-full overflow-y-auto">
      <BackHeader
        title={clubName}
        subtitle={`멤버 ${memberCount}명`}
        backTo="/meeting"
        rightSlot={
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(`/group-members?clubId=${clubId}`)}
              className="material-symbols-outlined text-on-surface-variant p-1 active:scale-95 transition-transform"
            >
              group
            </button>
            {isAdmin && (
              <button
                onClick={() => navigate(`/club-settings?clubId=${clubId}`)}
                className="material-symbols-outlined text-on-surface-variant p-1 active:scale-95 transition-transform"
              >
                settings
              </button>
            )}
          </div>
        }
      />
      <main className="p-5 pb-32">
        {/* 디스코드 봇 연동 배너 (관리자 전용) */}
        {isAdmin && botInviteUrl && (
          <button
            type="button"
            onClick={() => window.open(botInviteUrl, "_blank")}
            className="w-full flex items-center gap-3 mb-4 px-4 py-3 bg-[#5865F2]/10 rounded-xl text-left"
          >
            <span className="material-symbols-outlined text-[#5865F2] text-[22px]">smart_toy</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface">디스코드 봇 연동</p>
              <p className="text-xs text-on-surface-variant">봇을 서버에 초대하여 채널 자동 생성을 활성화하세요</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">open_in_new</span>
          </button>
        )}

        {/* 검색바 */}
        <div className="relative mb-6">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="참여하고 싶은 이벤트를 찾아보세요"
            className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>

        {/* 이벤트 헤더 */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-on-surface">
            다가오는 이벤트
          </h2>
        </div>

        {/* 이벤트 카드 목록 */}
        <div className="space-y-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <ErrorFallback onRetry={refetch} />
          ) : filtered.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-8 text-center">
              이벤트가 없습니다
            </p>
          ) : (
            filtered.map((event) => (
              <EventCard
                key={event.eventId}
                event={event}
                {...(isAdmin && {
                  onClick: () => navigate(`/qr-info?eventId=${event.eventId}`),
                })}
                onJoin={() =>
                  navigate(`/event-info?eventId=${event.eventId}`)
                }
              />
            ))
          )}
        </div>
      </main>

      {/* FAB - 이벤트 추가 (운영진 전용) */}
      {isAdmin && (
        <button
          onClick={() => navigate(`/create-event?clubId=${clubIdParam}`)}
          className="fixed bottom-8 right-6 w-14 h-14 bg-gradient-to-br from-primary-bright to-primary rounded-full shadow-lg flex items-center justify-center text-white active:scale-90 transition-all z-[60]"
        >
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      )}
    </div>
  );
}
