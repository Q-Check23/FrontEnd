import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BottomBar from "../../components/BottomBar";
import {
  getEventDetail,
  type EventDetail,
  updateEvent,
} from "../../api/events";
import { ToastContext } from "../../context/ToastContext";

type ToastValue = {
  push: (message: string) => void;
};

type DraftEvent = {
  title: string;
  date: string;
  time: string;
  location: string;
  isActive: boolean;
};

function formatDateTime(value: string) {
  if (!value) {
    return "일시 미정";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function splitStartTime(value: string) {
  if (!value.includes("T")) {
    return { date: "", time: "19:00" };
  }

  const [datePart, timePart = "19:00:00"] = value.split("T");

  return {
    date: datePart ?? "",
    time: timePart.slice(0, 5) || "19:00",
  };
}

function buildStartTime(date: string, time: string) {
  return `${date}T${time}:00`;
}

function FieldBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#ededed] bg-[#fcfcfc] px-4 py-3">
      <p className="text-xs font-medium text-[#808080]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#111111]">{value}</p>
    </div>
  );
}

export default function EventInfo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useContext(ToastContext) as ToastValue | null;
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [draft, setDraft] = useState<DraftEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const eventIdParam = searchParams.get("eventId");
  const eventId = eventIdParam ? Number(eventIdParam) : NaN;

  const syncDraft = (detail: EventDetail) => {
    const { date, time } = splitStartTime(detail.startTime);

    setDraft({
      title: detail.title,
      date,
      time,
      location: detail.location,
      isActive: detail.isActive,
    });
  };

  const loadEvent = async () => {
    if (!Number.isFinite(eventId)) {
      setError("유효한 eventId가 없습니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const nextDetail = await getEventDetail(eventId);
      setEventDetail(nextDetail);
      syncDraft(nextDetail);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "행사 정보를 불러오지 못했습니다.";
      setError(message);
      toast?.push(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadEvent();
  }, [eventIdParam]);

  const handleShare = async () => {
    if (!eventDetail || !navigator.share) {
      return;
    }

    try {
      await navigator.share({
        title: eventDetail.title,
        text: `${eventDetail.title} - ${formatDateTime(eventDetail.startTime)}`,
      });
    } catch {
      // Ignore canceled shares.
    }
  };

  const handleSave = async () => {
    if (!eventDetail || !draft) {
      return;
    }

    if (!draft.title.trim()) {
      toast?.push("행사 제목을 입력해주세요.");
      return;
    }

    if (!draft.date || !draft.time) {
      toast?.push("행사 일시를 입력해주세요.");
      return;
    }

    setIsSaving(true);

    try {
      const updatedDetail = await updateEvent(eventDetail.eventId, {
        title: draft.title.trim(),
        startTime: buildStartTime(draft.date, draft.time),
        location: draft.location.trim(),
        isActive: draft.isActive,
      });

      setEventDetail(updatedDetail);
      syncDraft(updatedDetail);
      toast?.push("행사 정보를 저장했습니다.");
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "행사 수정에 실패했습니다.";
      toast?.push(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDraftChange = <K extends keyof DraftEvent>(
    key: K,
    value: DraftEvent[K],
  ) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-y-auto bg-[#f9f9f9] pb-24">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ececec] bg-[#f9f9f9] px-3 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-2xl text-black transition-opacity hover:opacity-70"
          aria-label="뒤로가기"
        >
          ‹
        </button>
        <h1 className="text-lg font-semibold text-[#111111]">행사 상세</h1>
        <button
          type="button"
          onClick={() => void handleShare()}
          className="text-xl text-black transition-opacity hover:opacity-70"
          aria-label="공유"
        >
          ⋯
        </button>
      </div>

      {isLoading ? (
        <div className="px-5 py-6">
          <div className="rounded-3xl bg-white px-5 py-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <p className="text-sm text-[#666666]">행사 정보를 불러오는 중입니다.</p>
          </div>
        </div>
      ) : error ? (
        <div className="px-5 py-6">
          <div className="rounded-3xl bg-white px-5 py-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <p className="text-sm font-medium text-[#d93025]">{error}</p>
            <button
              type="button"
              onClick={() => void loadEvent()}
              className="mt-4 rounded-xl bg-[#111111] px-4 py-2 text-sm font-medium text-white"
            >
              다시 시도
            </button>
          </div>
        </div>
      ) : eventDetail && draft ? (
        <>
          <div className="px-5 pt-5">
            <div className="inline-flex rounded-full bg-gradient-to-r from-[#621783] to-[#ae29e9] px-3 py-1 text-sm font-semibold text-white">
              Event ID {eventDetail.eventId}
            </div>

            <div className="mt-4 rounded-3xl bg-white px-5 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <h2 className="text-2xl font-bold text-[#111111]">
                {eventDetail.title}
              </h2>
              <p className="mt-3 text-base font-medium text-[#4f4f4f]">
                {formatDateTime(eventDetail.startTime)}
              </p>
              <p className="mt-2 text-sm text-[#808080]">
                {eventDetail.location || "장소 미등록"}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <FieldBadge label="클럽 ID" value={String(eventDetail.clubId)} />
                <FieldBadge
                  label="상태"
                  value={eventDetail.isActive ? "진행 중" : "비활성"}
                />
              </div>
            </div>
          </div>

          <div className="px-5 pt-4">
            <div className="rounded-3xl bg-white px-5 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/participants?eventId=${eventDetail.eventId}`)}
                  className="rounded-xl border border-[#d9d9d9] px-4 py-2 text-sm font-medium text-[#111111]"
                >
                  참가자 목록 보기
                </button>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">행사 수정</h3>
                  <p className="mt-1 text-sm text-[#808080]">
                    `PUT /api/events/{eventDetail.eventId}`로 저장됩니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-xl bg-[#111111] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-[#d9d9d9]"
                >
                  {isSaving ? "저장 중" : "저장"}
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#666666]">
                    행사 제목
                  </label>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(event) => handleDraftChange("title", event.target.value)}
                    className="h-12 w-full rounded-2xl border border-[#d5d5d5] px-4 outline-none focus:border-[#702f95]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#666666]">
                      날짜
                    </label>
                    <input
                      type="date"
                      value={draft.date}
                      onChange={(event) => handleDraftChange("date", event.target.value)}
                      className="h-12 w-full rounded-2xl border border-[#d5d5d5] px-4 outline-none focus:border-[#702f95]"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#666666]">
                      시간
                    </label>
                    <input
                      type="time"
                      value={draft.time}
                      onChange={(event) => handleDraftChange("time", event.target.value)}
                      className="h-12 w-full rounded-2xl border border-[#d5d5d5] px-4 outline-none focus:border-[#702f95]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-[#666666]">
                    장소
                  </label>
                  <input
                    type="text"
                    value={draft.location}
                    onChange={(event) => handleDraftChange("location", event.target.value)}
                    placeholder="장소를 입력해주세요"
                    className="h-12 w-full rounded-2xl border border-[#d5d5d5] px-4 outline-none focus:border-[#702f95]"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-[#111111]">
                  <input
                    type="checkbox"
                    checked={draft.isActive}
                    onChange={(event) =>
                      handleDraftChange("isActive", event.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  행사 활성 상태 유지
                </label>
              </div>
            </div>
          </div>

          <div className="px-5 pt-4">
            <div className="rounded-3xl bg-white px-5 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <h3 className="text-lg font-bold text-[#111111]">신청 폼 항목</h3>
              <p className="mt-1 text-sm text-[#808080]">
                현재 상세 API에서 내려오는 `formFields`를 읽기 전용으로 표시합니다.
              </p>

              <div className="mt-4 flex flex-col gap-3">
                {eventDetail.formFields.length > 0 ? (
                  eventDetail.formFields.map((field) => (
                    <div
                      key={field.id}
                      className="rounded-2xl border border-[#ededed] bg-[#fcfcfc] px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#111111]">
                            {field.label || "라벨 없음"}
                          </p>
                          <p className="mt-1 text-xs text-[#808080]">
                            {field.type} · {field.required ? "필수" : "선택"}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#f0ebfa] px-3 py-1 text-xs font-semibold text-[#702f95]">
                          #{field.id}
                        </span>
                      </div>

                      {field.options.length > 0 ? (
                        <p className="mt-3 text-sm text-[#666666]">
                          선택지: {field.options.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#d9d9d9] bg-[#fcfcfc] px-4 py-5 text-sm text-[#666666]">
                    등록된 추가 신청 항목이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}

      <BottomBar activeItem="activity" />
    </div>
  );
}
