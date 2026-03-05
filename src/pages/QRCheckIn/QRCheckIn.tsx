import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface CheckedInAttendee {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatar?: string;
}

export default function QRCheckIn() {
  const navigate = useNavigate();
  const [showPanel, setShowPanel] = useState(true);
  const [checkedInCount, setCheckedInCount] = useState(12);
  const totalCapacity = 40;

  // Mock checked-in attendees data
  const [checkedInAttendees] = useState<CheckedInAttendee[]>([
    {
      id: "1",
      name: "이서연",
      role: "참가자",
      phone: "010-1234-5678",
    },
    {
      id: "2",
      name: "이서연",
      role: "참가자",
      phone: "010-1234-5678",
    },
    {
      id: "3",
      name: "이서연",
      role: "참가자",
      phone: "010-1234-5678",
    },
  ]);

  const handleChevronClick = () => {
    setShowPanel(!showPanel);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-center py-4 pt-6">
        <h1 className="text-2xl font-bold text-white">QR 체크인</h1>
      </div>

      {/* QR Scanner Area */}
      <div className="flex-1 flex items-center justify-center px-5">
        <div className="w-56 h-56 border-2 border-white rounded-2xl bg-[rgba(255,255,255,0.1)] flex flex-col items-center justify-end p-4">
          <p className="text-sm font-semibold text-white text-center">
            사각형 안에 QR코드를 맞춰주세요
          </p>
        </div>
      </div>

      {/* Bottom Sheet Panel */}
      <div
        className={`absolute left-0 right-0 bg-[#fdfdfd] rounded-t-2xl shadow-lg transition-all duration-300 ease-out ${
          showPanel ? "bottom-0 max-h-[428px]" : "bottom-0 h-16"
        }`}
      >
        {/* Chevron & Header */}
        <div className="flex flex-col items-center pt-5 pb-2">
          <button
            onClick={handleChevronClick}
            className="text-gray-700 hover:text-gray-900 transition-colors p-2"
            aria-label="Toggle panel"
          >
            <svg
              className={`w-8 h-8 transition-transform duration-300 ${
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

        {/* Panel Content */}
        {showPanel && (
          <div className="px-5 overflow-y-auto max-h-[360px]">
            {/* Status Header */}
            <div className="flex items-center justify-between p-5 rounded-lg mb-4 bg-white">
              <h2 className="text-base font-bold text-[#080808]">
                실시간 입장 현황
              </h2>
              <p className="text-base font-bold text-[#702f95] tracking-widest">
                {checkedInCount}/{totalCapacity}명
              </p>
            </div>

            {/* Attendee List */}
            <div className="space-y-0">
              {checkedInAttendees.map((attendee, index) => (
                <div
                  key={attendee.id}
                  className={`flex gap-3 p-5 items-center ${
                    index !== checkedInAttendees.length - 1
                      ? "border-b border-[#808080] border-opacity-50"
                      : ""
                  } rounded-lg`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#e8b4f1] to-[#d499e0] rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {attendee.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-[#080808] leading-7 tracking-wide">
                      {attendee.name}
                    </p>
                    <p className="text-sm font-normal text-[#808080] leading-7">
                      {attendee.role} • {attendee.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Spacing for scroll */}
            <div className="h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
