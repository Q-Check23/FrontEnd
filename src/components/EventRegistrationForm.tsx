import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJoinClubViaEvent, useMyClubs, useMyProfile } from "../hooks";
import { useToastStore } from "../stores/useToastStore";
import type { EventDetail } from "../api/events";
import type { MyProfile } from "../api/users";

interface EventRegistrationFormProps {
  event: EventDetail;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (answers: Array<{ fieldId: number; value: string }>) => void;
  onCancel?: () => void;
}

/**
 * 폼 필드 label을 키워드로 추측해 사용자 프로필 값으로 자동입력한다.
 * 폼 필드엔 의미 매핑이 없으므로(자유 텍스트 label뿐) 휴리스틱으로만 채운다.
 * 못 맞히면 빈칸으로 두며, 채운 값도 사용자가 자유롭게 수정 가능하다.
 */
function guessProfileValue(
  label: string,
  profile: MyProfile,
): string | undefined {
  if (/이름|성함|실명|name/i.test(label)) return profile.realName || undefined;
  if (/전화|연락처|휴대폰|핸드폰|phone|mobile/i.test(label))
    return profile.phone || undefined;
  if (/이메일|메일|email/i.test(label)) return profile.email || undefined;
  return undefined;
}

export default function EventRegistrationForm({
  event,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: EventRegistrationFormProps) {
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.push);
  const { data: myClubs = [], isLoading: clubsLoading } = useMyClubs();
  const { data: profile } = useMyProfile();
  const joinMutation = useJoinClubViaEvent();
  const [joinedNow, setJoinedNow] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // 프로필 로드 시 1회만, 비어있는 TEXT 필드에 한해 자동입력한다.
  // (SELECT는 옵션 기반이라 제외, 사용자가 이미 입력한 값은 prev로 보존)
  const prefilledRef = useRef(false);
  useEffect(() => {
    if (prefilledRef.current || !profile) return;
    const seeded: Record<number, string> = {};
    for (const field of event.formFields) {
      if (field.type === "SELECT") continue;
      const guess = guessProfileValue(field.label, profile);
      if (guess) seeded[field.id] = guess;
    }
    prefilledRef.current = true;
    if (Object.keys(seeded).length > 0) {
      setAnswers((prev) => ({ ...seeded, ...prev }));
    }
  }, [profile, event.formFields]);

  const isMember = myClubs.some((club) => club.clubId === event.clubId);
  const needsJoinPrompt = !clubsLoading && !isMember && !joinedNow;

  function handleConfirmJoin() {
    joinMutation.mutate(event.eventId, {
      onSuccess: () => {
        setJoinedNow(true);
        pushToast("모임에 가입되었어요");
      },
      onError: (error) => {
        pushToast(error instanceof Error ? error.message : "가입에 실패했어요");
      },
    });
  }

  function handleChange(fieldId: number, value: string) {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleSubmit() {
    const payload = event.formFields.map((field) => ({
      fieldId: field.id,
      value: answers[field.id] ?? "",
    }));
    onSubmit(payload);
  }

  function handleCancelJoin() {
    if (onCancel) {
      onCancel();
      return;
    }
    navigate(-1);
  }

  return (
    <>
      <main className="px-5 py-6 space-y-6">
        {/* 행사 정보 요약 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              event_note
            </span>
            <h2 className="text-xl font-semibold">행사 정보</h2>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-1">
            <p className="text-base font-bold">{event.title}</p>
            <p className="text-sm text-on-surface-variant">
              {event.location || "장소 미정"}
            </p>
          </div>
        </section>

        {/* 등록 폼 필드 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              assignment_ind
            </span>
            <h2 className="text-xl font-semibold">참가자 정보</h2>
          </div>
          <div className="space-y-3">
            {event.formFields.map((field) => (
              <div
                key={field.id}
                className={`bg-surface-container-lowest p-4 rounded-xl shadow-sm ${
                  field.required ? "border-l-4 border-primary" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-on-surface">
                    {field.label}
                  </label>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      field.required
                        ? "text-primary bg-primary/10"
                        : "text-on-surface-variant bg-surface-container-high"
                    }`}
                  >
                    {field.required ? "필수" : "선택"}
                  </span>
                </div>
                {field.type === "SELECT" ? (
                  <select
                    value={answers[field.id] ?? ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="">선택해주세요</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={answers[field.id] ?? ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    placeholder={`${field.label}을(를) 입력해주세요`}
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 w-full p-5 bg-surface/70 backdrop-blur-xl z-50">
        <button
          onClick={handleSubmit}
          disabled={submitting || needsJoinPrompt}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl text-xl font-semibold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {submitting ? "처리 중..." : submitLabel}
        </button>
      </div>

      {/* 가입 확인 모달 */}
      {needsJoinPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-on-surface/40 backdrop-blur-[2px]">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full text-center shadow-xl border border-outline-variant">
            <h2 className="text-xl font-bold text-on-surface mb-2">
              모임에 등록하시겠습니까?
            </h2>
            <p className="text-sm text-on-surface-variant mb-6">
              계속 진행하려면 먼저 이 모임의 멤버가 되어야 합니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelJoin}
                disabled={joinMutation.isPending}
                className="flex-1 border-2 border-outline-variant text-on-surface py-3 rounded-xl text-base font-semibold active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmJoin}
                disabled={joinMutation.isPending}
                className="flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary py-3 rounded-xl text-base font-semibold active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                {joinMutation.isPending ? "가입 중..." : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
