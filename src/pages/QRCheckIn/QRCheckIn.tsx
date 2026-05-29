import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { type AttendanceCheckInResult } from "../../api/attendance";
import { useEventRegistrations, useManualCheckIn } from "../../hooks";
import { useToastStore } from "../../stores/useToastStore";

type ScanState = "scanning" | "success" | "register";

// 체크인 QR에서 eventId 추출.
// 외부 기본 카메라와 동일한 QR(URL)을 인앱 스캐너도 인식하도록 통일.
function parseEventIdFromQr(decodedText: string): number | null {
  // 체크인 QR(URL): https://qcheck.asia/checkin?eventId=123
  try {
    const url = new URL(decodedText);
    const id = Number(url.searchParams.get("eventId"));
    if (Number.isInteger(id) && id > 0) return id;
  } catch {
    // URL이 아니면 레거시 포맷 확인으로 폴백
  }
  // 레거시 포맷: QCHECK:CHECKIN:123
  const match = decodedText.match(/^QCHECK:CHECKIN:(\d+)$/);
  if (match) {
    const id = Number(match[1]);
    if (id > 0) return id;
  }
  return null;
}

export default function QRCheckIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get("eventId") || "0");
  const pushToast = useToastStore((state) => state.push);

  const [state, setState] = useState<ScanState>("scanning");
  const [result, setResult] = useState<AttendanceCheckInResult | null>(null);

  // on-site registration form (운영진용 직접 등록)
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);
  const handleScanRef = useRef<(decodedText: string) => void>(() => {});

  const manualCheckInMutation = useManualCheckIn(eventId);
  const { data: registrations = [] } = useEventRegistrations(eventId);

  const handleScan = useCallback(
    (decodedText: string) => {
      if (processingRef.current) return;

      const scannedEventId = parseEventIdFromQr(decodedText);
      if (!scannedEventId) {
        pushToast("올바른 체크인 QR 코드가 아닙니다.");
        return;
      }

      processingRef.current = true;

      // 스캔 성공 시 카메라 일시 정지
      scannerRef.current?.pause(true);

      // 외부 카메라 스캔과 동일한 처리 경로(/checkin)로 진입.
      // 모임 가입 / 사전 등록 / 체크인 분기를 /checkin이 일괄 처리.
      navigate(`/checkin?eventId=${scannedEventId}`);
    },
    [navigate, pushToast],
  );

  // 최신 handleScan을 ref에 유지 (useEffect 내 stale closure 방지)
  handleScanRef.current = handleScan;

  const handleConfirmSuccess = useCallback(() => {
    setResult(null);
    setState("scanning");
    processingRef.current = false;
    // useEffect가 state==="scanning" 감지해서 새 스캐너를 시작함
  }, []);

  // QR 스캐너 시작/정지 관리
  useEffect(() => {
    if (state !== "scanning") return;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 }, disableFlip: false },
        (decodedText) => handleScanRef.current(decodedText),
        () => {}, // QR 미감지 시 무시
      )
      .catch(() => {
        pushToast("카메라를 사용할 수 없어요. 권한을 확인해주세요.");
      });

    return () => {
      scanner
        .stop()
        .catch(() => {});
      scannerRef.current = null;
    };
  }, [state]); // handleScan은 의도적으로 제외 (ref 기반 처리)

  const handleRegisterSubmit = useCallback(() => {
    const name = regName.trim();
    if (!name) {
      pushToast("이름을 입력해주세요.");
      return;
    }

    const nameKey = name.toLowerCase();
    const phoneDigits = regPhone.replace(/\D/g, "");

    const active = registrations.filter((r) => r.status !== "CANCELED");
    const nameMatches = active.filter(
      (r) => r.realName?.trim().toLowerCase() === nameKey,
    );

    const candidates =
      phoneDigits.length > 0
        ? nameMatches.filter((r) =>
            r.answers.some((a) =>
              a.value.replace(/\D/g, "").includes(phoneDigits),
            ),
          )
        : nameMatches;

    if (candidates.length === 0) {
      pushToast(
        nameMatches.length === 0
          ? "등록자를 찾을 수 없어요."
          : "전화번호가 일치하는 등록자가 없어요.",
      );
      return;
    }

    if (candidates.length > 1) {
      pushToast("동명이인이 있어요. 전화번호로 식별해주세요.");
      return;
    }

    const target = candidates[0];
    if (!target) return;
    if (target.status === "CHECKED_IN") {
      pushToast("이미 체크인된 참가자예요.");
      return;
    }

    manualCheckInMutation.mutate(
      { registrationId: target.registrationId },
      {
        onSuccess: (data) => {
          setResult(data);
          setState("success");
          setRegName("");
          setRegPhone("");
        },
        onError: (error) => {
          pushToast(
            error instanceof Error ? error.message : "체크인에 실패했어요",
          );
        },
      },
    );
  }, [regName, regPhone, registrations, manualCheckInMutation, pushToast]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Camera Preview - html5-qrcode가 여기에 비디오를 렌더링 */}
      <div
        id="qr-reader"
        className="fixed inset-0 z-0"
      />
      {/* html5-qrcode 기본 UI 숨기고 비디오만 풀스크린 표시 */}
      <style>{`
        #qr-reader {
          border: none !important;
          width: 100% !important;
          height: 100% !important;
        }
        #qr-reader video {
          width: 100vw !important;
          height: 100vh !important;
          object-fit: cover !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
        }
        #qr-reader img[alt="Info icon"],
        #qr-reader img[alt="Camera based scan"],
        #qr-reader span,
        #qr-reader br {
          display: none !important;
        }
        #qr-shaded-region {
          display: none !important;
        }
        #qr-reader > div:not(:has(video)) {
          display: none !important;
        }
      `}</style>

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col h-screen pointer-events-none">
        {/* TopAppBar */}
        <header className="flex items-center px-5 h-14 w-full bg-transparent fixed top-0 left-0 right-0 z-20 pointer-events-auto">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 active:opacity-70 transition-opacity p-2 -ml-2 rounded-full hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[28px]">
              arrow_back
            </span>
          </button>
          <h1 className="text-xl font-semibold">QR 스캔</h1>
        </header>

        {/* Main Scanner Canvas */}
        <main className="flex-grow flex flex-col items-center justify-center px-5">
          {/* Scanning Area Indicator */}
          <div className="relative w-full max-w-[280px] aspect-square mb-6">
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20" />
            {/* Corner Indicators */}
            <div className="absolute top-[-2px] left-[-2px] w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
            <div className="absolute top-[-2px] right-[-2px] w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
            <div className="absolute bottom-[-2px] left-[-2px] w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
            <div className="absolute bottom-[-2px] right-[-2px] w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-2xl" />
            {/* Scanning Line */}
            <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-primary shadow-[0_0_15px_rgba(159,0,180,0.8)] opacity-70" />
          </div>

          {/* Instruction */}
          <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-full">
            <p className="text-base font-medium text-center">
              QR 코드를 사각형 안에 맞춰주세요
            </p>
          </div>
        </main>

        {/* Bottom Actions */}
        <footer className="pb-12 flex flex-col items-center gap-3 pointer-events-auto">
          {/* Manual Registration */}
          <button
            onClick={() => setState("register")}
            className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-medium active:scale-95 transition-transform"
          >
            참가자 직접 등록
          </button>
        </footer>
      </div>

      {/* Gradient overlays for readability */}
      <div className="fixed inset-0 pointer-events-none z-[5]">
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Success Modal (운영진 직접 등록 결과) */}
      {state === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-surface/90 backdrop-blur-md">
          <div className="bg-surface-container rounded-2xl p-8 max-w-sm w-full text-center shadow-xl border border-outline-variant">
            <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-6">
              <span
                className="material-symbols-outlined text-on-primary-container text-[40px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-2">
              인증 완료
            </h2>
            <p className="text-sm text-on-surface-variant mb-2">
              성공적으로 행사에 체크인 되었습니다.
            </p>
            {result && (
              <p className="text-base font-semibold text-primary mb-8">
                {result.username}
              </p>
            )}
            <button
              onClick={handleConfirmSuccess}
              className="w-full py-4 bg-primary text-white rounded-xl text-xl font-semibold active:opacity-70 transition-opacity"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* On-site Registration Modal */}
      {state === "register" && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-on-surface mb-1">
                참가자 직접 등록
              </h1>
              <p className="text-sm text-on-surface-variant">
                정보를 입력하여 입장 처리합니다.
              </p>
            </div>

            {/* Form */}
            <div className="w-full space-y-4 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant block ml-1">
                  이름
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="이름을 입력하세요 (예: 홍길동)"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant block ml-1">
                  전화번호
                </label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="전화번호 뒤 4자리"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col items-center gap-3">
              <button
                onClick={handleRegisterSubmit}
                disabled={manualCheckInMutation.isPending}
                className="w-full bg-gradient-to-br from-primary-container to-primary py-4 rounded-xl text-white text-xl font-semibold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">how_to_reg</span>
                {manualCheckInMutation.isPending ? "처리 중..." : "입장 처리"}
              </button>
              <button
                onClick={() => setState("scanning")}
                className="text-on-surface-variant text-base font-medium hover:text-primary transition-colors py-2 active:scale-95"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
