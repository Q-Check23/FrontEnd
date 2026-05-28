import { useNavigate } from "react-router-dom";
import { useMyProfile, useMyStats, useLogout } from "../../hooks";
import { useToastStore } from "../../stores/useToastStore";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError, refetch } = useMyProfile();
  const { data: stats } = useMyStats();
  const logoutMutation = useLogout();
  const pushToast = useToastStore((state) => state.push);

  const displayName = profile?.realName || profile?.username || "사용자";

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSettled: () => navigate("/landing", { replace: true }),
    });
  }

  if (isLoading) {
    return (
      <>
        <ProfileHeader onSettingsClick={() => navigate("/profile/settings")} />
        <main className="mt-20 px-5 flex flex-col gap-6 pb-24">
          <LoadingSpinner />
        </main>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <ProfileHeader onSettingsClick={() => navigate("/profile/settings")} />
        <main className="mt-20 px-5 flex flex-col gap-6 pb-24">
          <ErrorFallback onRetry={refetch} />
        </main>
      </>
    );
  }

  return (
    <>
      <ProfileHeader onSettingsClick={() => navigate("/profile/settings")} />

      <main className="mt-20 px-5 flex flex-col gap-6 pb-24">
        {/* 프로필 섹션 */}
        <section className="bg-gradient-to-br from-primary-bright to-primary-dark rounded-xl p-5 text-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-20 h-20 flex-shrink-0">
              <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center border-4 border-white/20">
                <span className="material-symbols-outlined text-white text-4xl">
                  person
                </span>
              </div>
              <div className="absolute bottom-0 right-0 bg-white text-primary w-6 h-6 rounded-full flex items-center justify-center border-2 border-primary-container">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  edit
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold">{displayName}</span>
              </div>
              <p className="text-sm text-white/80">
                {profile ? `ID: ${profile.username}` : ""}
              </p>
            </div>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-xl rounded-lg p-3 text-center border border-white/10">
              <p className="text-xl font-semibold">{stats?.attended ?? 0}</p>
              <p className="text-xs font-semibold text-white/70">참여한 행사</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-lg p-3 text-center border border-white/10">
              <p className="text-xl font-semibold">{stats?.upcoming ?? 0}</p>
              <p className="text-xs font-semibold text-white/70">예정된 행사</p>
            </div>
          </div>
        </section>

        {/* 연락처 정보 */}
        <section className="bg-surface-container-lowest rounded-xl p-5 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">mail</span>
            </div>
            <p className="text-xs font-semibold text-on-surface-variant flex-shrink-0">이메일</p>
            <p className="text-base font-medium truncate">{profile?.email || "-"}</p>
          </div>
          <div className="h-px bg-outline-variant/30 w-full" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-tertiary">call</span>
            </div>
            <p className="text-xs font-semibold text-on-surface-variant flex-shrink-0">휴대폰 번호</p>
            <p className="text-base font-medium truncate">{profile?.phone || "-"}</p>
          </div>
        </section>

        {/* 메뉴 */}
        <section className="flex flex-col gap-1">
          <h3 className="text-xs font-semibold text-on-surface-variant px-1 mb-2">
            지원 및 정보
          </h3>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_2px_8px_0px_rgba(0,0,0,0.02)]">
            <button onClick={() => pushToast("도움말 페이지 준비 중입니다")} className="w-full flex items-center justify-between p-4 hover:bg-surface-container transition-colors group">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">help</span>
                <span className="text-base font-medium">도움말</span>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
            <div className="mx-4 h-px bg-outline-variant/10" />
            <button onClick={() => pushToast("QCheck v1.0.0")} className="w-full flex items-center justify-between p-4 hover:bg-surface-container transition-colors group">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">info</span>
                <span className="text-base font-medium">앱 정보</span>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
          </div>
        </section>

        {/* 로그아웃 */}
        <section className="mt-4 mb-8">
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full py-4 px-5 flex items-center justify-center gap-2 text-[#ba1a1a] text-base font-medium hover:bg-[#ffdad6]/10 transition-colors rounded-xl border border-[#ba1a1a]/20 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">logout</span>
            {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
          </button>
        </section>
      </main>
    </>
  );
}

function ProfileHeader({ onSettingsClick }: { onSettingsClick?: () => void }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 shadow-sm flex items-center justify-between px-5 h-16">
      <div className="flex items-center gap-1">
        <span className="material-symbols-outlined text-primary">
          qr_code_scanner
        </span>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          내 정보
        </h1>
      </div>
      <button
        onClick={onSettingsClick}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors"
      >
        <span className="material-symbols-outlined text-on-surface-variant">
          settings
        </span>
      </button>
    </header>
  );
}
