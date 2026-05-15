import type { ClubRole } from "../../../api/clubs";

interface MemberCardProps {
  username: string;
  role: ClubRole;
  hasMenu: boolean;
  onMenuClick: () => void;
}

const ROLE_LABEL: Record<ClubRole, string> = {
  OWNER: "운영자",
  ADMIN: "운영진",
  MEMBER: "멤버",
};

export default function MemberCard({
  username,
  role,
  hasMenu,
  onMenuClick,
}: MemberCardProps) {
  const isStaff = role === "OWNER" || role === "ADMIN";

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/10 active:scale-[0.98] transition-transform">
      <div className="relative w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
        <span
          className={`material-symbols-outlined text-[28px] ${
            isStaff ? "text-primary" : "text-on-surface-variant"
          }`}
        >
          person
        </span>
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4CAF50] border-2 border-white rounded-full" />
      </div>
      <div className="grow">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-on-surface">{username}</span>
          {isStaff && (
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              {ROLE_LABEL[role]}
            </span>
          )}
        </div>
      </div>
      {hasMenu && (
        <button
          onClick={onMenuClick}
          className="material-symbols-outlined text-on-surface-variant p-1 active:scale-95 transition-transform"
        >
          more_vert
        </button>
      )}
    </div>
  );
}
