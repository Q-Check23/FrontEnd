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

  const isRegistered =
    myRegistration != null && myRegistration.status !== "CANCELED";
  const isCheckedIn = myRegistration?.status === "CHECKED_IN";

  const completedRef = useRef(false);

  function completeCheckIn(alreadyCheckedIn: boolean) {
    const goToDetail = () =>
      navigate(`/event-info?eventId=${eventId}`, { replace: true });

    if (alreadyCheckedIn) {
      pushToast("이미 참여 완료된 행사예요");
      goToDetail();
      return;
    }

    selfCheckInMutation.mutate(
      { eventId },
      {
        onSuccess: () => {
          pushToast("참여가 완료되었어요");
          goToDetail();
        },
        onError: (error) => {
          // 이미 체크인된 상태(409)는 사실상 성공 — 멱등 처리.
          // stale 캐시로 REGISTERED라 판단해 self-check-in을 쐈는데
          // 서버는 이미 CHECKED_IN인 경우, 백엔드 영문 메시지를 그대로
          // 노출하지 않고 친화적 문구로 안내한다.
          if (error instanceof ApiError && error.status === 409) {
            pushToast(
              error.message.includes("checked in")
                ? "이미 참여 완료된 행사예요"
                : error.message,
            );
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
      <EventRegistrationForm
        event={event}
        submitLabel="참여하기"
        submitting={createMutation.isPending || selfCheckInMutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
