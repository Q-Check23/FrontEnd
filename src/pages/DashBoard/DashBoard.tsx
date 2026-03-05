import { useState } from "react";
import BottomBar from "../../components/BottomBar";

type TabType = "qr" | "dashboard" | "participants";

export default function DashBoard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Mock event data
  const eventData = {
    totalRegistrations: 1234,
    actualAttendance: 876,
    realTimeCheckIn: 876,
    description: "",
    location: "",
    time: "",
    capacity: "",
  };

  const StatCard = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <div className="bg-[#fdfdfd] border border-[#d9d9d9] rounded-lg px-3 py-4 flex-1 flex flex-col items-center justify-center h-18">
      <p className="text-lg font-medium text-black text-center">{label}</p>
      <p className="text-xl font-bold text-black text-center mt-1">
        {value.toLocaleString?.("ko-KR") || value}
      </p>
    </div>
  );

  const InfoBox = ({
    label,
    value,
    highlighted = false,
  }: {
    label: string;
    value?: string;
    highlighted?: boolean;
  }) => (
    <div
      className={`border border-[#d9d9d9] rounded-lg px-4 py-2.5 flex items-center h-12 ${
        highlighted
          ? "bg-[rgba(239,227,254,0.3)]"
          : "bg-[#fdfdfd]"
      }`}
    >
      <p className="text-lg font-semibold text-black">{label}</p>
      {value && (
        <p className="text-lg font-semibold text-black ml-auto">{value}</p>
      )}
    </div>
  );

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
            activeTab === "qr" ? "text-black" : "text-black"
          }`}
        >
          등록 QR 링크
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
            activeTab === "participants" ? "text-black" : "text-black"
          }`}
        >
          참가자 목록
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#f9f9f9]">
        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Stat Cards */}
          <div className="flex gap-4">
            <StatCard label="총 등록수" value={eventData.totalRegistrations} />
            <StatCard
              label="실제 입장 수"
              value={eventData.actualAttendance}
            />
          </div>

          {/* Real-time Check-in Status */}
          <div className="bg-[rgba(239,227,254,0.3)] border border-[#d9d9d9] rounded-lg px-4 py-3 flex flex-col gap-2 min-h-[151px]">
            <p className="text-lg font-medium text-black">
              실시간 입장 현장
            </p>
            <p className="text-2xl font-bold text-black">
              {eventData.realTimeCheckIn}
            </p>
          </div>

          {/* Description Box */}
          <div className="bg-[#fdfdfd] border border-[#d9d9d9] rounded-lg px-4 py-3 flex flex-col min-h-[104px]">
            <p className="text-lg font-semibold text-black">설명:</p>
          </div>

          {/* Information Fields */}
          <div className="flex flex-col gap-3">
            <InfoBox label="장소:" highlighted />
            <InfoBox label="시간:" highlighted />
            <InfoBox label="인원 수:" highlighted />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomBar activeItem="activity" />
    </div>
  );
}
