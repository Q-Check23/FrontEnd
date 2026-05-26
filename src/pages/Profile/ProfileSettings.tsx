import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyProfile, useUpdateProfile } from "../../hooks";
import BackHeader from "../../components/BackHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError, refetch } = useMyProfile();
  const updateMutation = useUpdateProfile();

  const [realName, setRealName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile) {
      setRealName(profile.realName);
      setUsername(profile.username);
      setPhone(profile.phone);
    }
  }, [profile]);

  function handleSave() {
    updateMutation.mutate(
      { realName: realName.trim(), username: username.trim(), phone: phone.trim() },
      { onSuccess: () => navigate("/profile") },
    );
  }

  if (isLoading) {
    return (
      <div className="bg-surface h-full overflow-y-auto pb-32">
        <BackHeader title="프로필 수정" />
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-surface h-full overflow-y-auto pb-32">
        <BackHeader title="프로필 수정" />
        <ErrorFallback onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="bg-surface h-full overflow-y-auto pb-32">
      <BackHeader title="프로필 수정" />

      <main className="px-5 py-6 space-y-6">
        <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-2">
              이름
            </label>
            <input
              type="text"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              placeholder="실명을 입력하세요"
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-2">
              닉네임
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-2">
              이메일
            </label>
            <input
              type="text"
              value={profile?.email ?? ""}
              disabled
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm text-on-surface-variant opacity-60"
            />
            <p className="text-xs text-on-surface-variant mt-1">이메일은 변경할 수 없습니다</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-2">
              전화번호
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-5 bg-surface/70 backdrop-blur-xl z-50">
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl text-xl font-semibold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {updateMutation.isPending ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
}
