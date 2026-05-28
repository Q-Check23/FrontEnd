import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useCreateRegistration,
  useEventDetail,
  useJoinClubViaEvent,
  useMyClubs,
} from "../../hooks";
import { useToastStore } from "../../stores/useToastStore";
import BackHeader from "../../components/BackHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";

export default function Register() {
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.push);
  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get("eventId"));
  const { data: event, isLoading, isError, refetch } = useEventDetail(eventId);
  const { data: myClubs = [], isLoading: clubsLoading } = useMyClubs();
  const mutation = useCreateRegistration(eventId);
  const joinMutation = useJoinClubViaEvent();
  const [joinedNow, setJoinedNow] = useState(false);

  const [answers, setAnswers] = useState<Record<number, string>>({});

  const isMember = event
    ? myClubs.some((club) => club.clubId === event.clubId)
    : false;
  const needsJoinPrompt =
    Boolean(event) && !clubsLoading && !isMember && !joinedNow;

  function handleConfirmJoin() {
    joinMutation.mutate(eventId, {
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
    if (!event) return;

    const payload = event.formFields.map((field) => ({
      fieldId: field.id,
      value: answers[field.id] ?? "",
    }));

    mutation.mutate(
      { answers: payload },
      {
        onSuccess: () => navigate(`/qr-info?eventId=${eventId}`),
      },
    );
  }

  if (isLoading) {
    return (
      <div className="bg-surface h-full overflow-y-auto pb-32">
        <BackHeader title="사전 등록" />
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="bg-surface h-full overflow-y-auto pb-32">
        <BackHeader title="사전 등록" />
        <ErrorFallback onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="bg-surface h-full overflow-y-auto pb-32">
      <BackHeader title="사전 등록" subtitle={event.title} />

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
          disabled={mutation.isPending || needsJoinPrompt}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl text-xl font-semibold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {mutation.isPending ? "등록 중..." : "사전 등록하기"}
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
              사전 등록을 진행하려면 먼저 이 모임의 멤버가 되어야 합니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
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
    </div>
  );
}
