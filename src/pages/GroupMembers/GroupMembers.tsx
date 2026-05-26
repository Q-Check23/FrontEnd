import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BackHeader from "../../components/BackHeader";
import GroupTabs from "../../components/GroupTabs";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";
import MemberCard from "./components/MemberCard";
import MemberActionSheet, {
  type MemberAction,
} from "./components/MemberActionSheet";
import AddMemberSheet from "./components/AddMemberSheet";
import {
  useAddClubMember,
  useClubMembers,
  useLeaveClub,
  useMyClubs,
  useMyProfile,
  useRemoveClubMember,
  useUpdateClubMemberRole,
} from "../../hooks";
import { useToastStore } from "../../stores/useToastStore";
import type { ClubMember } from "../../api/clubs";
import type { UserSearchResult } from "../../api/users";

function resolveActions(
  viewerIsAdmin: boolean,
  isSelf: boolean,
  targetRole: ClubMember["role"],
): MemberAction[] {
  if (isSelf) return ["leave"];
  if (!viewerIsAdmin) return [];
  if (targetRole === "OWNER") return [];
  if (targetRole === "ADMIN") return ["demote", "kick"];
  return ["promote", "kick"];
}

export default function GroupMembers() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.push);

  const clubId = Number(searchParams.get("clubId"));
  const role = searchParams.get("role") ?? "";
  const isAdmin = role === "ADMIN" || role === "OWNER";
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ClubMember | null>(null);
  const [pendingAction, setPendingAction] = useState<MemberAction | null>(null);
  const [isAddSheetOpen, setAddSheetOpen] = useState(false);

  const { data: members = [], isLoading, isError, refetch } = useClubMembers(clubId);
  const { data: clubs = [] } = useMyClubs();
  const { data: myProfile } = useMyProfile();

  const updateRole = useUpdateClubMemberRole(clubId);
  const removeMember = useRemoveClubMember(clubId);
  const leave = useLeaveClub(clubId);
  const addMember = useAddClubMember(clubId);

  const handleAddMember = async (user: UserSearchResult) => {
    try {
      await addMember.mutateAsync({ userId: user.userId });
      pushToast(`${user.username} 님을 모임에 추가했어요`);
      setAddSheetOpen(false);
    } catch (error) {
      pushToast(
        error instanceof Error ? error.message : "멤버 추가에 실패했어요",
      );
    }
  };

  const currentClub = clubs.find((club) => club.clubId === clubId);
  const clubName = currentClub?.clubName ?? "";

  const filtered = query.trim()
    ? members.filter((member) =>
        member.username.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : members;

  const handleSelect = async (action: MemberAction) => {
    if (!selected) return;

    const confirmMessages: Partial<Record<MemberAction, string>> = {
      leave: "정말 이 모임에서 탈퇴하시겠습니까?",
      kick: `${selected.username} 님을 모임에서 내보내시겠습니까?`,
    };
    const confirmMessage = confirmMessages[action];
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    try {
      setPendingAction(action);
      switch (action) {
        case "promote":
          await updateRole.mutateAsync({
            memberId: selected.memberId,
            body: { role: "ADMIN" },
          });
          pushToast(`${selected.username} 님을 운영진으로 임명했어요`);
          break;
        case "demote":
          await updateRole.mutateAsync({
            memberId: selected.memberId,
            body: { role: "MEMBER" },
          });
          pushToast(`${selected.username} 님을 일반 멤버로 변경했어요`);
          break;
        case "kick":
          await removeMember.mutateAsync(selected.memberId);
          pushToast(`${selected.username} 님을 내보냈어요`);
          break;
        case "leave":
          await leave.mutateAsync();
          pushToast("모임에서 탈퇴했어요");
          navigate("/meetings", { replace: true });
          return;
      }
      setSelected(null);
    } catch (error) {
      pushToast(
        error instanceof Error ? error.message : "요청을 처리하지 못했어요",
      );
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="bg-surface h-full overflow-y-auto">
      <BackHeader
        title={clubName}
        subtitle={`멤버 ${members.length}명`}
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
            filtered.map((member) => {
              const isSelf = myProfile?.id === member.userId;
              const actions = resolveActions(isAdmin, isSelf, member.role);
              return (
                <MemberCard
                  key={member.memberId}
                  username={member.username}
                  role={member.role}
                  hasMenu={actions.length > 0}
                  onMenuClick={() => setSelected(member)}
                />
              );
            })
          )}
        </section>
      </main>

      {/* FAB - 멤버 추가 (운영자 전용) */}
      {isAdmin && (
        <button
          onClick={() => setAddSheetOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container text-white shadow-lg flex items-center justify-center z-50 active:scale-90 transition-transform"
        >
          <span
            className="material-symbols-outlined text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            person_add
          </span>
        </button>
      )}

      <AddMemberSheet
        open={isAddSheetOpen}
        existingUserIds={members.map((m) => m.userId)}
        isAdding={addMember.isPending}
        onAdd={handleAddMember}
        onClose={() => setAddSheetOpen(false)}
      />

      <MemberActionSheet
        member={selected}
        actions={
          selected
            ? resolveActions(
                isAdmin,
                myProfile?.id === selected.userId,
                selected.role,
              )
            : []
        }
        pendingAction={pendingAction}
        onSelect={handleSelect}
        onClose={() => {
          if (pendingAction !== null) return;
          setSelected(null);
        }}
      />
    </div>
  );
}
