interface MemberCardProps {
  name: string;
  isAdmin: boolean;
  joinedAt: string;
}

export default function MemberCard({ name, isAdmin, joinedAt }: MemberCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/10 active:scale-[0.98] transition-transform">
      <div className="relative w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
        <span
          className={`material-symbols-outlined text-[28px] ${
            isAdmin ? "text-primary" : "text-on-surface-variant"
          }`}
        >
          person
        </span>
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4CAF50] border-2 border-white rounded-full" />
      </div>
      <div className="grow">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-on-surface">{name}</span>
          {isAdmin && (
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              운영진
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-on-surface-variant mt-0.5">
          {joinedAt} 가입
        </p>
      </div>
      <button className="material-symbols-outlined text-on-surface-variant">
        more_vert
      </button>
    </div>
  );
}
