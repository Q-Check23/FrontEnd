import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateRegistration, useEventDetail } from "../../hooks";
import { useToastStore } from "../../stores/useToastStore";
import BackHeader from "../../components/BackHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";
import EventRegistrationForm from "../../components/EventRegistrationForm";

export default function Register() {
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.push);
  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get("eventId"));
  const { data: event, isLoading, isError, refetch } = useEventDetail(eventId);
  const mutation = useCreateRegistration(eventId);

  function handleSubmit(answers: Array<{ fieldId: number; value: string }>) {
    mutation.mutate(
      { answers },
      {
        onSuccess: () => {
          pushToast("사전 등록이 완료되었어요");
          navigate(`/event-info?eventId=${eventId}`);
        },
        onError: (error) => {
          pushToast(
            error instanceof Error ? error.message : "등록에 실패했어요",
          );
        },
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
      <EventRegistrationForm
        event={event}
        submitLabel="사전 등록하기"
        submitting={mutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
