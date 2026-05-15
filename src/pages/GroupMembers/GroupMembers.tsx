import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackHeader from "../../components/BackHeader";
import GroupTabs from "../../components/GroupTabs";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";
import MemberCard from "./components/MemberCard";
import { useClubMembers, useMyClubs } from "../../hooks";

export default function GroupMembers() {
  const [searchParams] = useSearchParams();
  const clubId = Number(searchParams.get("clubId"));
  const role = searchParams.get("role") ?? "";
  const isAdmin = role === "ADMIN" || role === "OWNER";
  const [query, setQuery] = useState("");

  const { data: members = [], isLoading, isError, refetch } = useClubMembers(clubId);
  const { data: clubs = [] } = useMyClubs();

  const currentClub = clubs.find((club) => club.clubId === clubId);
  const clubName = currentClub?.clubName ?? "";

  const filtered = query.trim()
    ? members.filter((member) =>
        member.username.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : members;

  return (
    <div className="bg-surface h-full overflow-y-auto">
      <BackHeader title={clubName} subtitle={`멤버 ${members.length}명`} />
      <GroupTabs activeTab="members" />

      <main className="pb-24">
        {/* 검색 & 필터 */}
        <div className="px-5 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full flex-1 mr-3 border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="멤버 검색"
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full p-0"
            />
          </div>
          <button className="material-symbols-outlined text-on-surface-variant bg-surface-container px-3 py-2 rounded-xl active:scale-95 transition-transform">
            filter_list
          </button>
        </div>

        {/* 멤버 목록 */}
        <section className="px-5 py-4 flex flex-col gap-3">
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <ErrorFallback onRetry={refetch} />
          ) : filtered.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-8 text-center">
              {query.trim() ? "검색 결과가 없습니다" : "멤버가 없습니다"}
            </p>
          ) : (
            filtered.map((member) => (
              <MemberCard
                key={member.memberId}
                username={member.username}
                role={member.role}
              />
            ))
          )}
        </section>
      </main>

      {/* FAB - 멤버 추가 (운영자 전용) */}
      {isAdmin && (
        <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container text-white shadow-lg flex items-center justify-center z-50 active:scale-90 transition-transform">
          <span
            className="material-symbols-outlined text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            person_add
          </span>
        </button>
      )}
    </div>
  );
}
