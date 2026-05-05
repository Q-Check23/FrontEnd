import { useContext, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  checkInAttendance,
  type AttendanceCheckInResult,
} from "../../api/attendance";
import { ToastContext } from "../../context/ToastContext";

type ToastValue = {
  push: (message: string) => void;
};

function formatDateTime(value: string) {
  if (!value) {
    return "시간 정보 없음";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function CheckInRecord({
  record,
}: {
  record: AttendanceCheckInResult;
}) {
  return (
    <div className="rounded-2xl border border-[#ececec] bg-white px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#e8f7ee] text-lg font-bold text-[#009a49]">
          {record.username.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-[#111111]">
            {record.username}
          </p>
          <p className="mt-1 text-sm text-[#5f6368]">
            {formatDateTime(record.checkInTime)}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#e7f6ee] px-3 py-1 text-xs font-semibold text-[#009a49]">
          완료
        </span>
      </div>

      <p className="mt-3 text-xs text-[#9a9a9a]">
        Registration ID {record.registrationId}
      </p>
    </div>
  );
}

export default function QRCheckIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useContext(ToastContext) as ToastValue | null;
  const [showPanel, setShowPanel] = useState(true);
  const [qrToken, setQrToken] = useState("");
  const [recentCheckIns, setRecentCheckIns] = useState<AttendanceCheckInResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const eventIdParam = searchParams.get("eventId");

  const latestCheckIn = recentCheckIns[0] ?? null;
  const sessionCount = recentCheckIns.length;

  const helperText = useMemo(() => {
    if (eventIdParam) {
      return `Event ID ${eventIdParam} 체크인 화면`;
    }

    return "현재 세션 기준 체크인 화면";
  }, [eventIdParam]);

  const handleSubmit = async () => {
    const trimmedToken = qrToken.trim();

    if (!trimmedToken) {
      toast?.push("raw qrToken을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await checkInAttendance({ qrToken: trimmedToken });
      setRecentCheckIns((current) => [result, ...current]);
      setQrToken("");
      toast?.push(`${result.username} 체크인을 완료했습니다.`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "체크인 처리에 실패했습니다.";
      toast?.push(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-black">
      <div className="flex items-center justify-between px-5 py-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-2xl text-white transition-opacity hover:opacity-70"
          aria-label="뒤로가기"
        >
          ‹
        </button>
        <h1 className="text-2xl font-bold text-white">QR 체크인</h1>
        <div className="w-4" />
      </div>

      <div className="px-5">
        <p className="text-center text-sm text-white/70">{helperText}</p>
      </div>

      <div className="flex-1 px-5 py-6">
        <div className="flex h-full flex-col items-center justify-center rounded-[28px] border border-white/20 bg-white/10 px-6">
          <div className="flex h-40 w-40 items-center justify-center rounded-[28px] border-2 border-dashed border-white/60">
            <div className="text-center text-white">
              <p className="text-lg font-semibold">스캐너 준비 전</p>
              <p className="mt-2 text-sm text-white/70">
                지금은 raw qrToken 수동 입력으로 연동합니다.
              </p>
            </div>
          </div>

          <div className="mt-8 w-full max-w-[320px]">
            <label className="mb-2 block text-sm font-medium text-white/80">
              QR Token
            </label>
            <textarea
              value={qrToken}
              onChange={(event) => setQrToken(event.target.value)}
              placeholder="550e8400-e29b-41d4-a716-446655440000"
              className="min-h-[104px] w-full rounded-2xl border border-white/20 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/60"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-4 h-12 w-full rounded-2xl bg-white font-semibold text-black disabled:cursor-not-allowed disabled:bg-white/40"
            >
              {isSubmitting ? "체크인 처리 중..." : "체크인 처리"}
            </button>
            <p className="mt-3 text-xs leading-5 text-white/60">
              백엔드 기준으로는 raw `qrToken` 문자열만 받습니다. URL 형식 QR은 아직 표준이
              확정되지 않아 이번 연동에서는 다루지 않습니다.
            </p>
          </div>

          {latestCheckIn ? (
            <div className="mt-8 rounded-2xl bg-[#e7f6ee] px-4 py-3 text-center">
              <p className="text-sm font-medium text-[#009a49]">마지막 체크인</p>
              <p className="mt-1 text-lg font-bold text-[#111111]">
                {latestCheckIn.username}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div
        className={`absolute left-0 right-0 rounded-t-[28px] bg-[#fdfdfd] shadow-lg transition-all duration-300 ease-out ${
          showPanel ? "bottom-0 max-h-[460px]" : "bottom-0 h-16"
        }`}
      >
        <div className="flex flex-col items-center pt-4 pb-2">
          <button
            type="button"
            onClick={() => setShowPanel((current) => !current)}
            className="p-2 text-gray-700 transition-colors hover:text-gray-900"
            aria-label="패널 열기/닫기"
          >
            <svg
              className={`h-8 w-8 transition-transform duration-300 ${
                showPanel ? "rotate-0" : "rotate-180"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>

        {showPanel ? (
          <div className="max-h-[380px] overflow-y-auto px-5 pb-6">
            <div className="rounded-2xl bg-white px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#080808]">
                    이번 세션 체크인 기록
                  </h2>
                  <p className="mt-1 text-sm text-[#808080]">
                    서버에는 목록 조회 API가 없어 현재 세션 성공 기록만 누적합니다.
                  </p>
                </div>
                <p className="text-base font-bold tracking-wide text-[#702f95]">
                  {sessionCount}명
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {recentCheckIns.length > 0 ? (
                recentCheckIns.map((record) => (
                  <CheckInRecord
                    key={`${record.registrationId}-${record.checkInTime}`}
                    record={record}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#d9d9d9] bg-white px-4 py-5 text-sm text-[#666666]">
                  아직 처리된 체크인이 없습니다.
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
