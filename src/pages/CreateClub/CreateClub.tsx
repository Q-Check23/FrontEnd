import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackHeader from "../../components/BackHeader";
import { useCreateClub } from "../../hooks";
import { useToastStore } from "../../stores/useToastStore";

export default function CreateClub() {
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.push);
  const mutation = useCreateClub();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discordGuildId, setDiscordGuildId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  const isValid = name.trim().length > 0 && description.trim().length > 0;

  function handleSubmit() {
    if (!isValid) return;
    mutation.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        discordGuildId: discordGuildId.trim(),
        coverImageUrl: coverImageUrl.trim(),
      },
      {
        onSuccess: () => {
          pushToast("새 모임을 만들었어요");
          navigate(-1);
        },
        onError: (error) => {
          pushToast(
            error instanceof Error ? error.message : "모임 생성에 실패했어요",
          );
        },
      },
    );
  }

  return (
    <div className="bg-surface h-full overflow-y-auto pb-32">
      <BackHeader title="새 모임 만들기" />

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
              placeholder="예: KUIT"
            />
            <Field
              label="모임 설명"
              required
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
            추가 설정 (선택)
          </h2>
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-4">
            <Field
              label="Discord 서버 ID"
              value={discordGuildId}
              onChange={setDiscordGuildId}
              placeholder="비워두면 연동 안 함"
            />
            <Field
              label="커버 이미지 URL"
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              placeholder="https://..."
            />
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-5 bg-surface/70 backdrop-blur-xl z-50">
        <button
          onClick={handleSubmit}
          disabled={!isValid || mutation.isPending}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl text-xl font-semibold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {mutation.isPending ? "생성 중..." : "모임 만들기"}
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
