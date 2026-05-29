import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { type EventRegistration } from "../../api/events";
import { useEventRegistrations } from "../../hooks";
import { useToastStore } from "../../stores/useToastStore";
import EventManageHeader from "../../components/EventManageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";

type StatusFilter = "all" | "CHECKED_IN" | "REGISTERED" | "CANCELED";

export default function EventParticipants() {
  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get("eventId"));
  const {
    data: registrations = [],
    isLoading,
    isError,
    refetch,
  } = useEventRegistrations(eventId);
  const pushToast = useToastStore((state) => state.push);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const registrationLink = `https://qcheck.asia/register?eventId=${eventId}`;

  const checkedInCount = registrations.filter(
    (r) => r.status === "CHECKED_IN",
  ).length;

  const filtered =
    filter === "all"
      ? registrations
      : registrations.filter((r) => r.status === filter);

  return (
    <div className="bg-surface h-full overflow-y-auto">
      <EventManageHeader activeTab="participants" />

      <main className="p-5 pb-24">
        {/* Header */}
        <section className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">참가자 목록</h2>
            <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
              현재 참여 인원{" "}
              <span className="text-primary font-bold">
                {checkedInCount}/{registrations.length}명
              </span>
            </p>
          </div>
          <button
            onClick={async () => {
              // 모바일: OS 공유 시트 / PC: 클립보드 복사
              const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
              if (isMobile && navigator.share) {
                try {
                  await navigator.share({ title: "행사 사전 등록", url: registrationLink });
                } catch {
                  // 공유 취소 무시
                }
              } else {
                try {
                  await navigator.clipboard.writeText(registrationLink);
                  pushToast("사전 등록 링크가 복사되었어요");
                } catch {
                  const textarea = document.createElement("textarea");
                  textarea.value = registrationLink;
                  textarea.style.position = "fixed";
                  textarea.style.opacity = "0";
                  document.body.appendChild(textarea);
                  textarea.select();
                  document.execCommand("copy");
                  document.body.removeChild(textarea);
                  pushToast("사전 등록 링크가 복사되었어요");
                }
              }
            }}
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              person_add
            </span>
            초대하기
          </button>
        </section>

        {/* Filter Chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {(
            [
              { key: "all", label: "전체" },
              { key: "CHECKED_IN", label: "참여" },
              { key: "REGISTERED", label: "대기" },
              { key: "CANCELED", label: "불참" },
            ] as const
          ).map((chip) => (
            <button
              key={chip.key}
              onClick={() => setFilter(chip.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === chip.key
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Participant List */}
        <div className="space-y-3">
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <ErrorFallback onRetry={refetch} />
          ) : filtered.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-8 text-center">
              참가자가 없습니다
            </p>
          ) : (
            filtered.map((reg) => (
              <ParticipantCard key={reg.registrationId} registration={reg} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function ParticipantCard({
  registration,
}: {
  registration: EventRegistration;
}) {
  const status = getStatusDisplay(registration.status);
  const isAbsent = registration.status === "CANCELED";

  return (
    <div
      className={`bg-surface-container-lowest rounded-xl p-4 flex items-center justify-between shadow-[0px_4px_20px_rgba(0,0,0,0.04)] ${
        isAbsent ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center border-2 border-outline-variant shadow-sm">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">
              person
            </span>
          </div>
        </div>
        <div className="text-left">
          <span className="block text-base font-medium text-on-surface">
            {registration.realName || registration.username}
          </span>
          <p className="text-xs font-semibold text-on-surface-variant/70">
            @{registration.username}
          </p>
          {registration.status === "CHECKED_IN" && registration.checkInTime && (
            <p className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                schedule
              </span>
              {formatCheckInTime(registration.checkInTime)} 체크인
            </p>
          )}
        </div>
      </div>
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${status.className}`}
      >
        <span
          className="material-symbols-outlined text-[18px] flex items-center justify-center"
          style={status.iconFill ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          {status.icon}
        </span>
        <span className="text-xs font-semibold">{status.label}</span>
      </div>
    </div>
  );
}

function formatCheckInTime(value: string) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getStatusDisplay(status: string) {
  switch (status) {
    case "CHECKED_IN":
      return {
        label: "참여",
        icon: "check_circle",
        iconFill: true,
        className: "bg-emerald-100 text-emerald-700",
      };
    case "REGISTERED":
      return {
        label: "대기",
        icon: "schedule",
        iconFill: false,
        className: "bg-amber-100 text-amber-700",
      };
    case "CANCELED":
      return {
        label: "불참",
        icon: "cancel",
        iconFill: false,
        className: "bg-surface-container-high text-on-surface-variant",
      };
    default:
      return {
        label: status,
        icon: "help",
        iconFill: false,
        className: "bg-surface-container text-on-surface-variant",
      };
  }
}
