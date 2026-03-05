import { useState } from "react";
import BottomBar from "../../components/BottomBar";

type TabType = "qr" | "dashboard" | "participants";

export default function QRInfo() {
  const [activeTab, setActiveTab] = useState<TabType>("qr");
  const [copied, setCopied] = useState(false);

  const registrationUrl = "https://www.qcheck.com";
  const qrCodeImage = "http://localhost:3845/assets/7394bbd9e0ddace986aa0d1ce1a7dc798ca61fab.png";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    // Download QR code image
    const link = document.createElement("a");
    link.href = qrCodeImage;
    link.download = "qr-code.png";
    link.click();
  };

  const handlePrintQR = () => {
    // Print QR code
    const printWindow = window.open(qrCodeImage);
    if (printWindow) {
      printWindow.print();
    }
  };

  return (
    <div className="relative w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center py-5 border-b border-[#f0f0f0]">
        <h1 className="text-2xl font-medium text-black">KUIT</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-t border-[#c0c0c0]">
        <button
          onClick={() => setActiveTab("qr")}
          className={`flex-1 h-11 text-center font-medium text-lg px-6 py-2 border-b-[0.5px] border-[#c0c0c0] transition-colors ${
            activeTab === "qr" ? "text-[#649f76]" : "text-black"
          }`}
        >
          등록 QR 정보
        </button>
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 h-11 text-center font-medium text-lg px-6 py-2 border-b-[0.5px] border-[#c0c0c0] transition-colors ${
            activeTab === "dashboard" ? "text-[#649f76]" : "text-black"
          }`}
        >
          대시보드
        </button>
        <button
          onClick={() => setActiveTab("participants")}
          className={`flex-1 h-11 text-center font-medium text-lg px-6 py-2 border-b-[0.5px] border-[#c0c0c0] transition-colors ${
            activeTab === "participants" ? "text-[#649f76]" : "text-black"
          }`}
        >
          참가자 목록
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white px-4 py-6">
        <div className="flex flex-col gap-8 max-w-md mx-auto">
          {/* Registration Link Section */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-medium text-black">사전 등록 링크</h2>
            <div className="bg-[#f7f7f7] border border-[#f0f0f0] rounded-lg px-3 py-3 flex items-center justify-between h-12">
              <p className="text-xl font-medium text-black flex-1 truncate">
                {registrationUrl}
              </p>
              <button
                onClick={handleCopyUrl}
                title="Copy URL"
                className="flex-shrink-0 ml-2 p-1.5 hover:bg-[#eee] rounded transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="8" height="8" />
                  <rect x="13" y="3" width="8" height="8" />
                  <rect x="3" y="13" width="8" height="8" />
                  <rect x="13" y="13" width="8" height="8" />
                </svg>
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600">복사되었습니다</p>
            )}
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-medium text-black">사전 등록 QR 코드</h2>

            {/* QR Code Display */}
            <div className="bg-[#fafafa] border border-[#e9e9e9] rounded-lg p-8 flex items-center justify-center aspect-square">
              <img
                src={qrCodeImage}
                alt="QR Code"
                className="w-48 h-48 object-cover"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDownloadQR}
                className="flex-1 bg-[rgba(253,253,253,0.5)] border border-[#d9d9d9] rounded-lg px-6 py-3 flex items-center justify-center gap-1 hover:bg-[#f5f5f5] transition-colors h-12"
              >
                <svg
                  className="w-6 h-6 text-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span className="text-lg font-medium text-black">다운로드</span>
              </button>

              <button
                onClick={handlePrintQR}
                className="flex-1 bg-[rgba(253,253,253,0.5)] border border-[#d9d9d9] rounded-lg px-6 py-3 flex items-center justify-center gap-1 hover:bg-[#f5f5f5] transition-colors h-12"
              >
                <svg
                  className="w-6 h-6 text-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span className="text-lg font-medium text-black">인쇄하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomBar activeItem="activity" />
    </div>
  );
}
