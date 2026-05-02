import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BottomBar from "../../components/BottomBar";
import EventManageTabs from "../../components/EventManageTabs";
import {
  getEventRegistrations,
  type EventRegistration,
} from "../../api/events";
import { ToastContext } from "../../context/ToastContext";

type ToastValue = {
  push: (message: string) => void;
};

function getStatusDisplay(status: string) {
  switch (status) {
    case "CHECKED_IN":
      return {
        text: "입장 완료",
        color: "#009a49",
        bgColor: "#e7f6ee",
      };
    case "REGISTERED":
      return {
        text: "등록 완료",
        color: "#5f6368",
        bgColor: "#f1f3f4",
      };
    case "CANCELED":
      return {
        text: "취소",
        color: "#d93025",
        bgColor: "#fdecea",
      };
    default:
      return {
        text: status,
        color: "#702f95",
        bgColor: "#f0ebfa",
      };
  }
}

function RegistrationCard({
  registration,
}: {
  registration: EventRegistration;
}) {
  const statusDisplay = getStatusDisplay(registration.status);
  const answersPreview =
    registration.answers.length > 0
      ? registration.answers
          .map((answer) => `${answer.label}: ${answer.value || "-"}`)
          .join(" · ")
      : "추가 응답 없음";

  return (
    <div className="rounded-2xl border border-[#ececec] bg-white px-4 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#ebe7f9] text-lg font-bold text-[#702f95]">
            {registration.username.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[#111111]">
              {registration.username}
            </p>
            <p className="mt-1 text-xs text-[#808080]">
              User ID {registration.userId} · Registration ID {registration.registrationId}
            </p>
          </div>
        </div>
        <span
          className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            color: statusDisplay.color,
            backgroundColor: statusDisplay.bgColor,
          }}
        >
          {statusDisplay.text}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#5f6368]">{answersPreview}</p>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#9a9a9a]">
        <span className="truncate">
          QR Token {registration.qrToken || "미생성"}
        </span>
        <span>{registration.answers.length}개 응답</span>
      </div>
    </div>
  );
}

export default function EventParticipants() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useContext(ToastContext) as ToastValue | null;
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const eventIdParam = searchParams.get("eventId");
  const eventId = eventIdParam ? Number(eventIdParam) : NaN;

  const loadRegistrations = async () => {
    if (!Number.isFinite(eventId)) {
      setError("유효한 eventId가 없습니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const nextRegistrations = await getEventRegistrations(eventId);
      setRegistrations(nextRegistrations);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "참가자 목록을 불러오지 못했습니다.";
      setError(message);
      toast?.push(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRegistrations();
  }, [eventIdParam]);

  const checkedInCount = registrations.filter(
    (registration) => registration.status === "CHECKED_IN",
  ).length;

  return (
    <div className="relative flex h-full w-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-5">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">참가자 목록</h1>
          <p className="mt-2 text-sm text-[#808080]">
            관리자용 `/registrations` 응답을 그대로 표시합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-[#d9d9d9] px-3 py-2 text-sm font-medium text-[#111111]"
        >
          뒤로가기
        </button>
      </div>

      <EventManageTabs activeTab="participants" />

      <div className="flex-1 overflow-y-auto bg-[#f9f9f9] px-4 py-4 pb-24">
        {isLoading ? (
          <div className="rounded-3xl bg-white px-5 py-6 text-sm text-[#666666] shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            참가자 목록을 불러오는 중입니다.
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-white px-5 py-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <p className="text-sm font-medium text-[#d93025]">{error}</p>
            <button
              type="button"
              onClick={() => void loadRegistrations()}
              className="mt-4 rounded-xl bg-[#111111] px-4 py-2 text-sm font-medium text-white"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl bg-white px-5 py-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#111111]">
                    Event ID {Number.isFinite(eventId) ? eventId : "-"}
                  </h2>
                  <p className="mt-1 text-sm text-[#808080]">
                    입장 완료 {checkedInCount}명 / 전체 등록 {registrations.length}명
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void loadRegistrations()}
                  className="rounded-xl border border-[#d9d9d9] px-3 py-2 text-sm font-medium text-[#111111]"
                >
                  새로고침
                </button>
              </div>
            </div>

            {registrations.length > 0 ? (
              registrations.map((registration) => (
                <RegistrationCard
                  key={registration.registrationId}
                  registration={registration}
                />
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-[#d9d9d9] bg-white px-5 py-6 text-sm text-[#666666]">
                등록된 참가자가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>

      <BottomBar activeItem="activity" />
    </div>
  );
}
