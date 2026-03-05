import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomBar from "../../components/BottomBar";

type ParticipantStatus = "attended" | "waiting" | "absent";

interface Participant {
  id: string;
  name: string;
  role: "organizer" | "participant";
  status: ParticipantStatus;
  avatar?: string;
}

type TabType = "qr" | "dashboard" | "participants";

export default function EventParticipants() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("participants");

  // Mock participant data
  const [participants] = useState<Participant[]>([
    {
      id: "1",
      name: "김민우",
      role: "organizer",
      status: "attended",
    },
    {
      id: "2",
      name: "김지현",
      role: "participant",
      status: "attended",
    },
    {
      id: "3",
      name: "김서진",
      role: "participant",
      status: "waiting",
    },
    {
      id: "4",
      name: "박성현",
      role: "participant",
      status: "absent",
    },
  ]);

  const attendedCount = participants.filter(
    (p) => p.status === "attended"
  ).length;

  const getStatusDisplay = (status: ParticipantStatus) => {
    switch (status) {
      case "attended":
        return {
          text: "참여",
          color: "#009a49",
          icon: "✓",
        };
      case "waiting":
        return {
          text: "대기",
          color: "#808080",
          icon: "⏱",
        };
      case "absent":
        return {
          text: "불참",
          color: "#ff0000",
          icon: "✕",
        };
    }
  };

  const ParticipantCard = ({ participant }: { participant: Participant }) => {
    const statusDisplay = getStatusDisplay(participant.status);

    return (
      <div className="flex items-center justify-between gap-2 p-2.5 w-full">
        {/* Avatar and Info */}
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-15 h-15 bg-[#e8e8e8] rounded-full" />
          </div>

          {/* Name and Role */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-black">
                {participant.name}
              </span>
              {participant.role === "organizer" && (
                <span className="text-xs font-medium text-[#731fc0] bg-[#f2e4fd] px-3.75 py-0.5 rounded">
                  운영진
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-[#808080]">
              {participant.role === "organizer" ? "운영진" : "참가자"}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          {participant.status === "attended" && (
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#009a49"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {participant.status === "waiting" && (
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#808080"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          )}
          {participant.status === "absent" && (
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="#ff0000"
              stroke="#ff0000"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
          <span
            className="text-base font-medium w-7 text-center"
            style={{ color: statusDisplay.color }}
          >
            {statusDisplay.text}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center py-5">
        <h1 className="text-2xl font-medium text-black">KUIT</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-t border-b border-[#c0c0c0]">
        <button
          onClick={() => setActiveTab("qr")}
          className={`flex-1 h-11 text-center font-medium text-lg transition-colors ${
            activeTab === "qr"
              ? "text-black border-b-2 border-black"
              : "text-[#c0c0c0] text-black"
          }`}
        >
          등록 QR 링크
        </button>
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 h-11 text-center font-medium text-lg transition-colors ${
            activeTab === "dashboard"
              ? "text-black border-b-2 border-black"
              : "text-[#c0c0c0] text-black"
          }`}
        >
          대시보드
        </button>
        <button
          onClick={() => setActiveTab("participants")}
          className={`flex-1 h-11 text-center font-medium text-lg transition-colors ${
            activeTab === "participants"
              ? "text-[#649f76]"
              : "text-black"
          }`}
        >
          참가자 목록
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#f9f9f9] overflow-y-auto">
        <div className="bg-white rounded-t-3xl mt-6 p-6 flex flex-col gap-4">
          {/* Section Header */}
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-bold text-black">참가자 목록</h2>
            <span className="text-lg text-[#808080]">
              {attendedCount}/{participants.length}명
            </span>
          </div>

          {/* Participant List */}
          <div className="flex flex-col gap-3">
            {participants.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomBar activeItem="activity" />
    </div>
  );
}
