import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BackHeader from "../../components/BackHeader";
import { useClubDetail, useUpdateClub, useDiscordBotInviteUrl } from "../../hooks";
import { useToastStore } from "../../stores/useToastStore";

export default function ClubSettings() {
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.push);
  const [searchParams] = useSearchParams();
  const clubId = Number(searchParams.get("clubId") ?? "0");

  const { data: club, isLoading } = useClubDetail(clubId);
  const { data: botInviteUrl } = useDiscordBotInviteUrl();
  const mutation = useUpdateClub(clubId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discordGuildId, setDiscordGuildId] = useState("");

  useEffect(() => {
    if (club) {
      setName(club.clubName);
      setDescription(club.clubDescription);
      setDiscordGuildId(club.discordGuildId ?? "");
    }
  }, [club]);

  const hasChanges =
    club &&
    (name.trim() !== club.clubName ||
      description.trim() !== club.clubDescription ||
      discordGuildId.trim() !== (club.discordGuildId ?? ""));

  function handleSave() {
    if (!hasChanges) return;
    mutation.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        discordGuildId: discordGuildId.trim(),
      },
      {
        onSuccess: () => {
          pushToast("모임 정보를 수정했어요");
          navigate(-1);
        },
        onError: (error) => {
          pushToast(
            error instanceof Error ? error.message : "수정에 실패했어요",
          );
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="bg-surface h-full">
        <BackHeader title="모임 설정" />
        <div className="flex items-center justify-center py-20">
          <span className="text-on-surface-variant text-sm">불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface h-full overflow-y-auto pb-32">
      <BackHeader title="모임 설정" />

      <main className="px-5 py-6 space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              groups
            </span>
            기본 정보
          </h2>
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-4">
            <Field
              label="모임 이름"
              required
              value={name}
              onChange={setName}
              placeholder="모임 이름"
            />
            <Field
              label="모임 설명"
              value={description}
              onChange={setDescription}
              placeholder="어떤 모임인가요?"
              multiline
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              tune
            </span>
            디스코드 연동
          </h2>
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-4">
            <Field
              label="Discord 서버 ID"
              value={discordGuildId}
              onChange={setDiscordGuildId}
              placeholder="비워두면 연동 안 함"
            />
            {botInviteUrl && (
              <button
                type="button"
                onClick={() => window.open(botInviteUrl, "_blank")}
                className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
              >
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                디스코드 봇 초대하기
              </button>
            )}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-5 bg-surface/70 backdrop-blur-xl z-50">
        <button
          onClick={handleSave}
          disabled={!hasChanges || mutation.isPending || !name.trim()}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl text-xl font-semibold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {mutation.isPending ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

function Field({ label, required, value, onChange, placeholder, multiline }: FieldProps) {
  const className =
    "w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none";
  return (
    <div>
      <label className="text-xs font-semibold text-on-surface-variant block mb-2">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={className}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
        />
      )}
    </div>
  );
}
