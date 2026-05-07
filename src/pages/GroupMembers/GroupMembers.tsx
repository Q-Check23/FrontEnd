import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackHeader from "../../components/BackHeader";
import GroupTabs from "../../components/GroupTabs";
import MemberCard from "./components/MemberCard";

export default function GroupMembers() {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get("role") === "ADMIN";
  const [query, setQuery] = useState("");

  // TODO: API 연동 - 모임 정보 & 멤버 목록 조회
  const clubName = "KUIT";
  const memberCount = 124;

  const members = [
    { name: "김민우", isAdmin: true, joinedAt: "2021.03" },
    { name: "이지수", isAdmin: true, joinedAt: "2021.05" },
    { name: "박준현", isAdmin: false, joinedAt: "2022.01" },
    { name: "최아름", isAdmin: false, joinedAt: "2022.03" },
    { name: "강동훈", isAdmin: false, joinedAt: "2022.08" },
    { name: "윤지환", isAdmin: false, joinedAt: "2023.01" },
    { name: "정서연", isAdmin: false, joinedAt: "2023.04" },
  ];

  const filtered = query.trim()
    ? members.filter((m) =>
        m.name.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : members;

  return (
    <div className="bg-surface h-full overflow-y-auto">
      <BackHeader title={clubName} subtitle={`멤버 ${memberCount}명`} />
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
          {filtered.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-8 text-center">
              멤버가 없습니다
            </p>
          ) : (
            filtered.map((member, i) => (
              <MemberCard
                key={i}
                name={member.name}
                isAdmin={member.isAdmin}
                joinedAt={member.joinedAt}
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
