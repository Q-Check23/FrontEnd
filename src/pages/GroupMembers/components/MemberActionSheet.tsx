import type { ClubMember } from "../../../api/clubs";

export type MemberAction = "leave" | "promote" | "demote" | "kick";

interface ActionConfig {
  label: string;
  icon: string;
  destructive?: boolean;
}

const ACTION_CONFIG: Record<MemberAction, ActionConfig> = {
  leave: { label: "모임 탈퇴", icon: "logout", destructive: true },
  promote: { label: "운영진으로 임명", icon: "shield_person" },
  demote: { label: "일반 멤버로 변경", icon: "person" },
  kick: { label: "멤버 내보내기", icon: "person_remove", destructive: true },
};

interface MemberActionSheetProps {
  member: ClubMember | null;
  actions: MemberAction[];
  pendingAction: MemberAction | null;
  onSelect: (action: MemberAction) => void;
  onClose: () => void;
}

export default function MemberActionSheet({
  member,
  actions,
  pendingAction,
  onSelect,
  onClose,
}: MemberActionSheetProps) {
  if (!member) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface rounded-t-2xl pb-6 pt-3 px-2 animate-in slide-in-from-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto w-10 h-1 bg-outline-variant rounded-full mb-3" />
        <p className="px-4 pb-2 text-sm font-semibold text-on-surface-variant">
          {member.username}
        </p>
        <ul className="flex flex-col">
          {actions.map((action) => {
            const config = ACTION_CONFIG[action];
            const isPending = pendingAction === action;
            return (
              <li key={action}>
                <button
                  onClick={() => onSelect(action)}
                  disabled={pendingAction !== null}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl active:bg-surface-container disabled:opacity-50 transition-colors ${
                    config.destructive ? "text-red-600" : "text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {config.icon}
                  </span>
                  <span className="text-base font-semibold">
                    {isPending ? "처리 중..." : config.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <button
          onClick={onClose}
          disabled={pendingAction !== null}
          className="w-full mt-2 py-3 text-on-surface-variant text-sm font-semibold rounded-xl active:bg-surface-container disabled:opacity-50"
        >
          취소
        </button>
      </div>
    </div>
  );
}
