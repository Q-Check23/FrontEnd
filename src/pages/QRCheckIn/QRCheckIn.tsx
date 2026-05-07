import { useCallback, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { type AttendanceCheckInResult } from "../../api/attendance";
import { useCheckIn } from "../../hooks";

type ScanState = "scanning" | "success" | "register";

export default function QRCheckIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get("eventId") || "0");

  const [state, setState] = useState<ScanState>("scanning");
  const [flashOn, setFlashOn] = useState(false);
  const [result, setResult] = useState<AttendanceCheckInResult | null>(null);

  // on-site registration form
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);

  const checkInMutation = useCheckIn(eventId);

  const handleCheckIn = useCallback(
    (qrToken: string) => {
      checkInMutation.mutate(
        { qrToken },
        {
          onSuccess: (data) => {
            setResult(data);
            setState("success");
          },
        },
      );
    },
    [checkInMutation],
  );

  const handleConfirmSuccess = useCallback(() => {
    setResult(null);
    setState("scanning");
  }, []);

  const handleRegisterSubmit = useCallback(() => {
    // TODO: API 연동 - 현장 등록 처리
    setState("scanning");
    setRegName("");
    setRegPhone("");
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Camera Preview (placeholder) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      />

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* TopAppBar */}
        <header className="flex items-center px-5 h-14 w-full bg-transparent fixed top-0 left-0 right-0 z-20">
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
          {/* Scanning Area */}
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
        <footer className="pb-12 flex flex-col items-center gap-3">
          {/* Manual Registration */}
          <button
            onClick={() => setState("register")}
            className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-sm font-medium active:scale-95 transition-transform"
          >
            참가자 직접 등록
          </button>

          {/* Flashlight */}
          <button
            onClick={() => setFlashOn((v) => !v)}
            className={`w-16 h-16 rounded-full backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-lg active:scale-95 transition-transform ${
              flashOn ? "bg-white/40" : "bg-white/20 hover:bg-white/30"
            }`}
          >
            <span className="material-symbols-outlined text-[32px]">
              {flashOn ? "flashlight_off" : "flashlight_on"}
            </span>
          </button>
          <p className="text-white/60 text-xs font-semibold">
            {flashOn ? "손전등 끄기" : "손전등 켜기"}
          </p>
        </footer>
      </div>

      {/* Gradient overlays for readability */}
      <div className="fixed inset-0 pointer-events-none z-[5]">
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Success Modal */}
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
                className="w-full bg-gradient-to-br from-primary-container to-primary py-4 rounded-xl text-white text-xl font-semibold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">how_to_reg</span>
                입장 처리
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
