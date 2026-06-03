import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BackHeader from "../../components/BackHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";
import { useEventDetail, useUpdateEvent, useDeleteEvent } from "../../hooks";
import { useToastStore } from "../../stores/useToastStore";

function splitDateTime(iso: string) {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: "", time: "" };
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

export default function EditEvent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get("eventId"));
  const pushToast = useToastStore((state) => state.push);

  const { data: event, isLoading, isError, refetch } = useEventDetail(eventId);
  const mutation = useUpdateEvent(eventId);
  const deleteMutation = useDeleteEvent();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!event) return;
    setTitle(event.title);
    setDescription(event.description);
    const { date, time } = splitDateTime(event.startTime);
    setDate(date);
    setTime(time);
    setLocation(event.location);
    setIsActive(event.isActive);
  }, [event]);

  if (isLoading) {
    return (
      <div className="bg-surface h-full overflow-y-auto">
        <BackHeader title="행사 수정" />
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="bg-surface h-full overflow-y-auto">
        <BackHeader title="행사 수정" />
        <ErrorFallback onRetry={refetch} />
      </div>
    );
  }

  const isValid = title.trim().length > 0 && date && time && location.trim().length > 0;

  function handleDelete() {
    if (!window.confirm("정말 이 행사를 삭제하시겠습니까?")) return;
    deleteMutation.mutate(eventId, {
      onSuccess: () => {
        pushToast("행사를 삭제했어요");
        navigate(-1);
      },
      onError: (error) => {
        pushToast(
          error instanceof Error ? error.message : "삭제에 실패했어요",
        );
      },
    });
  }

  function handleSubmit() {
    if (!isValid) return;
    const startTime = `${date}T${time}${time.length === 5 ? ":00" : ""}`;
    mutation.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        startTime,
        location: location.trim(),
        isActive,
      },
      {
        onSuccess: () => {
          pushToast("행사 정보를 수정했어요");
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

  return (
    <div className="bg-surface h-full overflow-y-auto pb-32">
      <BackHeader title="행사 수정" />

      <main className="px-5 py-6 space-y-6">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              event_note
            </span>
            기본 정보
          </h2>
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-4">
            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-2">
                행사 이름
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-2">
                상세 내용
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="행사에 대한 설명을 입력하세요"
                rows={4}
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-2">
                  시작 날짜
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-2">
                  시작 시간
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-2">
                장소
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* 사전등록 정보 수집 — 생성 시 결정된 값. 표시만 하고 변경 불가 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              assignment_ind
            </span>
            참가자 정보 수집
          </h2>
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between opacity-70">
            <div className="flex-1 pr-4">
              <p className="text-base font-medium text-on-surface">
                {event.collectRegistrationInfo ? "정보 수집 ON" : "정보 수집 OFF"}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                행사 생성 시에만 설정 가능합니다.
              </p>
            </div>
            <div
              className={`relative w-11 h-6 rounded-full shrink-0 ${
                event.collectRegistrationInfo ? "bg-primary" : "bg-outline-variant"
              }`}
              aria-disabled
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-surface rounded-full shadow ${
                  event.collectRegistrationInfo ? "translate-x-5" : ""
                }`}
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              toggle_on
            </span>
            상태
          </h2>
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex-1 pr-4">
              <p className="text-base font-medium text-on-surface">행사 활성 여부</p>
              <p className="text-xs font-semibold text-on-surface-variant mt-1">
                비활성 시 참가자에게 노출되지 않습니다.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-5 bg-surface/70 backdrop-blur-xl z-50 space-y-3">
        <button
          onClick={handleSubmit}
          disabled={!isValid || mutation.isPending}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl text-xl font-semibold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {mutation.isPending ? "저장 중..." : "저장하기"}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="w-full border-2 border-red-500 text-red-500 py-3 rounded-xl text-base font-semibold active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {deleteMutation.isPending ? "삭제 중..." : "행사 삭제"}
        </button>
      </div>
    </div>
  );
}
