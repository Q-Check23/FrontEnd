import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import EventManageHeader from "../../components/EventManageHeader";

export default function QRInfo() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");

  const qrRef = useRef<HTMLDivElement>(null);

  const registrationLink = `https://qcheck.asia/register?eventId=${eventId ?? ""}`;

  function handleCopyLink() {
    void navigator.clipboard.writeText(registrationLink);
  }

  function handleDownload() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const a = document.createElement("a");
      a.download = `qcheck-event-${eventId}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  }

  function handlePrint() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>QR 코드 인쇄</title></head>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
        ${svgData}
      </body></html>
    `);
    win.document.close();
    win.onload = () => { win.print(); win.close(); };
  }

  return (
    <div className="bg-surface h-full overflow-y-auto">
      <EventManageHeader activeTab="qr" />

      <main className="pt-14 px-5 pb-24">
        {/* 사전 등록 링크 */}
        <section className="mb-6">
          <h3 className="text-base font-semibold mb-3 text-on-surface">
            사전 등록 링크
          </h3>
          <div className="flex items-center gap-2 bg-surface-container-low p-4 rounded-xl border border-outline-variant focus-within:border-primary transition-colors">
            <input
              type="text"
              readOnly
              value={registrationLink}
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-on-surface"
            />
            <button
              onClick={handleCopyLink}
              className="text-primary hover:bg-primary-container/10 p-2 rounded-lg transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined">content_copy</span>
            </button>
          </div>
          <p className="text-xs font-semibold text-on-surface-variant mt-2 px-1">
            참가자들에게 전달할 공식 사전 등록 페이지 링크입니다.
          </p>
        </section>

        {/* QR 코드 */}
        <section className="mb-6">
          <h3 className="text-base font-semibold mb-3 text-on-surface">
            사전 등록 QR 코드
          </h3>
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center border border-outline-variant/30">
            {/* QR 코드 영역 */}
            <div ref={qrRef} className="relative w-64 h-64 bg-white p-4 rounded-xl shadow-inner flex items-center justify-center">
              <QRCodeSVG
                value={registrationLink}
                size={224}
                level="M"
              />
              {/* 코너 가이드 */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
            </div>

            {/* 버튼 */}
            <div className="mt-8 flex w-full gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center gap-2 py-4 rounded-xl text-base font-medium shadow-lg active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined">download</span>
                다운로드
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 border-2 border-primary text-primary flex items-center justify-center gap-2 py-4 rounded-xl text-base font-medium hover:bg-primary/5 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined">print</span>
                인쇄하기
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
