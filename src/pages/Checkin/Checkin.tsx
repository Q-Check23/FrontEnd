import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useCreateRegistration,
  useEventDetail,
  useMyEventRegistration,
  useSelfCheckIn,
} from "../../hooks";
import { useToastStore } from "../../stores/useToastStore";
import { ApiError } from "../../api/client";
import BackHeader from "../../components/BackHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";
import EventRegistrationForm from "../../components/EventRegistrationForm";

export default function Checkin() {
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.push);
  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get("eventId"));

  const { data: event, isLoading, isError, refetch } = useEventDetail(eventId);
  const {
    data: myRegistration,
    isLoading: regLoading,
    isFetching: regFetching,
  } = useMyEventRegistration(eventId);
  const createMutation = useCreateRegistration(eventId);
  const selfCheckInMutation = useSelfCheckIn(eventId);

  // 불참(CANCELED) 포함 — 등록 이력이 있으면 등록 폼이 아니라 체크인 경로를 탄다.
  // (불참자가 "Already registered"로 막히던 문제 방지. 백엔드도 CANCELED 체크인 허용)
  const isRegistered = myRegistration != null;
  const isCheckedIn = myRegistration?.status === "CHECKED_IN";

  const completedRef = useRef(false);

  function completeCheckIn(alreadyCheckedIn: boolean) {
    const goToDetail = () =>
      navigate(`/event-info?eventId=${eventId}`, { replace: true });

    if (alreadyCheckedIn) {
      // 이미 참여 완료된 상태는 정상이므로 토스트 없이 상세로 이동
      goToDetail();
      return;
    }

    selfCheckInMutation.mutate(
      { eventId },
      {
        onSuccess: () => {
          pushToast("참여가 완료되었어요", "success");
          goToDetail();
        },
        onError: (error) => {
          // 이미 체크인된 상태(409)는 사실상 성공 — 멱등 처리.
          // stale 캐시로 REGISTERED라 판단해 self-check-in을 쐈는데
          // 서버는 이미 CHECKED_IN인 경우다. 정상 상태이므로 토스트 없이
          // 조용히 상세로 이동한다. (단, 체크인 외 다른 409는 안내한다)
          if (error instanceof ApiError && error.status === 409) {
            if (!error.message.includes("checked in")) {
              pushToast(error.message);
            }
            goToDetail();
            return;
          }
          // 등록은 유지되므로 상세 페이지에서 상태 확인/재시도 가능
          pushToast(
            error instanceof Error ? error.message : "참여 처리에 실패했어요",
          );
          goToDetail();
        },
      },
    );
  }

  // 케이스 4: 이미 사전 등록된 사용자는 곧바로 체크인 처리 (1회만)
  useEffect(() => {
    // regFetching까지 기다려 신선한 상태로만 판단한다.
    // (staleTime=0이라 캐시가 있어도 백그라운드 재요청이 끝난 뒤 결정)
    if (regLoading || regFetching || !isRegistered || completedRef.current)
      return;
    completedRef.current = true;
    completeCheckIn(Boolean(isCheckedIn));
    // completeCheckIn은 의도적으로 deps에서 제외 (1회 실행 가드)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regLoading, regFetching, isRegistered, isCheckedIn]);

  function handleSubmit(answers: Array<{ fieldId: number; value: string }>) {
    createMutation.mutate(
      { answers },
      {
        onSuccess: () => completeCheckIn(false),
        onError: (error) => {
          pushToast(
            error instanceof Error ? error.message : "등록에 실패했어요",
          );
        },
      },
    );
  }

  if (isLoading || regLoading) {
    return (
      <div className="bg-surface h-full overflow-y-auto pb-32">
        <BackHeader title="행사 참여" />
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="bg-surface h-full overflow-y-auto pb-32">
        <BackHeader title="행사 참여" />
        <ErrorFallback onRetry={refetch} />
      </div>
    );
  }

  // 이미 등록된 사용자: 체크인 처리 중 화면
  if (isRegistered) {
    return (
      <div className="bg-surface h-full overflow-y-auto pb-32">
        <BackHeader title="행사 참여" subtitle={event.title} />
        <div className="flex flex-col items-center justify-center gap-4 px-5 py-20">
          <LoadingSpinner />
          <p className="text-sm text-on-surface-variant">참여 처리 중...</p>
        </div>
      </div>
    );
  }

  // 케이스 2·3: 미등록 (미가입이면 폼 내부 모달이 가입 처리)
  return (
    <div className="bg-surface h-full overflow-y-auto pb-32">
      <BackHeader title="행사 참여" subtitle={event.title} />
      {event.collectRegistrationInfo ? (
        <EventRegistrationForm
          event={event}
          submitLabel="참여하기"
          submitting={createMutation.isPending || selfCheckInMutation.isPending}
          onSubmit={handleSubmit}
        />
      ) : (
        <>
          <main className="px-5 py-6 space-y-6">
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
            <p className="text-sm text-on-surface-variant text-center pt-2">
              별도 입력 없이 한 번의 클릭으로 참여가 완료됩니다.
            </p>
          </main>
          <div className="fixed bottom-0 left-0 w-full p-5 bg-surface/70 backdrop-blur-xl z-50">
            <button
              onClick={() => handleSubmit([])}
              disabled={createMutation.isPending || selfCheckInMutation.isPending}
              className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl text-xl font-semibold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              {createMutation.isPending || selfCheckInMutation.isPending
                ? "처리 중..."
                : "참여하기"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
