import { useContext, useEffect, useState } from "react";
import { ToastContext } from "../../context/ToastContext";
import { getMyProfile, type MyProfile, updateMyProfile } from "../../api/users";

type ToastValue = {
  push: (message: string) => void;
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#ededed] bg-[#fdfdfd] px-4 py-3">
      <span className="text-sm font-medium text-[#666666]">{label}</span>
      <span className="text-sm font-semibold text-[#111111]">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const toast = useContext(ToastContext) as ToastValue | null;
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [draftRealName, setDraftRealName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadProfile = async () => {
    setIsLoading(true);
    setError("");

    try {
      const nextProfile = await getMyProfile();
      setProfile(nextProfile);
      setDraftRealName(nextProfile.realName);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "내 정보를 불러오지 못했습니다.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) {
      return;
    }

    const trimmedName = draftRealName.trim();

    if (!trimmedName) {
      toast?.push("이름을 입력해주세요.");
      return;
    }

    setIsSaving(true);

    try {
      const updatedProfile = await updateMyProfile({ realName: trimmedName });
      setProfile(updatedProfile);
      setDraftRealName(updatedProfile.realName);
      toast?.push("이름을 저장했습니다.");
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "이름 저장에 실패했습니다.";
      toast?.push(message);
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty =
    profile !== null && draftRealName.trim() !== profile.realName;
  const displayName = profile?.realName || profile?.username || "이름 미등록";
  const avatarText = displayName.charAt(0) || "?";
  const realNameValue = profile?.realName || "미등록";

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-y-auto bg-[#f5f5f5] pb-24"
    >
      <div className="bg-white px-5 pt-5 pb-4">
        <h1 className="text-[20px] font-bold text-[#111111]">내 정보</h1>
        <p className="mt-2 text-sm text-[#808080]">
          현재 API 제공 범위에 맞춰 기본 정보만 먼저 연동했습니다.
        </p>
      </div>

      {isLoading ? (
        <div className="px-4 py-6">
          <div className="rounded-3xl bg-white px-5 py-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <p className="text-sm text-[#666666]">내 정보를 불러오는 중입니다.</p>
          </div>
        </div>
      ) : error ? (
        <div className="px-4 py-6">
          <div className="rounded-3xl bg-white px-5 py-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <p className="text-sm font-medium text-[#d93025]">{error}</p>
            <button
              type="button"
              onClick={() => void loadProfile()}
              className="mt-4 rounded-xl bg-[#111111] px-4 py-2 text-sm font-medium text-white"
            >
              다시 시도
            </button>
          </div>
        </div>
      ) : profile ? (
        <>
          <div
            className="mx-4 mt-4 overflow-hidden rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, #5a1f7a 0%, #702f95 45%, #9b4fc4 100%)",
            }}
          >
            <div className="flex items-center gap-4 px-5 pt-5 pb-6">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white">
                {avatarText}
              </div>

              <div className="min-w-0">
                <p className="truncate text-[22px] font-bold text-white">
                  {displayName}
                </p>
                <p className="mt-1 text-sm text-white/80">@{profile.username}</p>
                <span className="mt-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                  USER #{profile.id}
                </span>
              </div>
            </div>
          </div>

          <div className="mx-4 mt-4 rounded-3xl bg-white px-4 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <p className="mb-3 text-sm font-semibold text-[#111111]">
              조회 가능한 기본 정보
            </p>
            <div className="flex flex-col gap-3">
              <InfoRow label="ID" value={String(profile.id)} />
              <InfoRow label="Username" value={profile.username} />
              <InfoRow label="실명" value={realNameValue} />
            </div>
          </div>

          <div className="mx-4 mt-4 rounded-3xl bg-white px-4 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#111111]">실명 수정</p>
                <p className="mt-1 text-xs text-[#808080]">
                  `PUT /api/users/me`로 저장됩니다.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="rounded-xl bg-[#111111] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-[#d9d9d9]"
              >
                {isSaving ? "저장 중" : "저장"}
              </button>
            </div>

            <div className="mt-4">
              <label
                htmlFor="real-name"
                className="mb-2 block text-xs font-medium text-[#666666]"
              >
                실명
              </label>
              <input
                id="real-name"
                type="text"
                value={draftRealName}
                onChange={(event) => setDraftRealName(event.target.value)}
                className="h-12 w-full rounded-2xl border border-[#d5d5d5] px-4 outline-none transition-colors focus:border-[#702f95]"
                placeholder="실명을 입력해주세요"
              />
            </div>
          </div>

          <div className="mx-4 mt-4 rounded-3xl border border-dashed border-[#d5d5d5] bg-white/80 px-4 py-4">
            <p className="text-sm text-[#666666]">
              이메일, 전화번호, 참여 통계는 현재 백엔드 API에서 제공되지 않아
              이번 연동 범위에서는 숨겼습니다.
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
