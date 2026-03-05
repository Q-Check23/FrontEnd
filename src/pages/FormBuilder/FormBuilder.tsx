import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleEvent from "../../components/ScheduleEvent";
import GradientButton from "../../components/GradientButton";
import BottomBar from "../../components/BottomBar";

interface ParticipantField {
  id: string;
  label: string;
  subtitle?: string;
}

export default function FormBuilder() {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [discordEnabled, setDiscordEnabled] = useState(true);
  const [participantFields, setParticipantFields] = useState<ParticipantField[]>([
    { id: "1", label: "참가자 실명", subtitle: "기본 정보" },
    { id: "2", label: "연락처 (전화번호)", subtitle: "기본 정보" },
    { id: "3", label: "소속/직무 입력", subtitle: "단답형 텍스트" },
  ]);

  const handleAddQuestion = () => {
    const newId = String(Math.max(...participantFields.map(f => Number(f.id)), 0) + 1);
    setParticipantFields([
      ...participantFields,
      { id: newId, label: "새 질문", subtitle: "단답형 텍스트" },
    ]);
  };

  const handleCreateEvent = () => {
    // Handle form submission
    console.log({
      eventName,
      location,
      discordEnabled,
      participantFields,
    });
  };

  return (
    <div className="relative w-full h-full bg-white">
      {/* Main Content */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-[#c9c9c9] bg-white px-5 py-2.5 flex gap-5 items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-2xl text-black hover:opacity-70 transition-opacity"
            aria-label="뒤로가기"
          >
            ‹
          </button>
          <h1 className="text-xl font-semibold text-black">폼 빌더</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-[#eee] px-4 py-4">
          <div className="flex flex-col gap-4 pb-28">
            {/* Basic Information Section */}
            <div className="bg-white border border-[#d9d9d9] rounded-xl p-6 flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-black">기본 정보</h2>

              {/* Event Name Input */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  모임 이름 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="모임 이름을 입력하세요"
                  className="w-full h-10 px-3 py-1.5 bg-[#fdfdfd] border border-[#e9e9e9] rounded-xl text-[#404040] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Date and Time Section */}
              <ScheduleEvent />

              {/* Location Input */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-black">
                  장소 <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="장소 입력 (선택 사항)"
                  className="w-full h-10 px-3 py-1.5 bg-[#fdfdfd] border border-[#e9e9e9] rounded-xl text-[#808080] text-sm font-medium placeholder:text-[#808080] focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            {/* Settings Section */}
            <div className="bg-white border border-[#d9d9d9] rounded-xl p-6 flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-black">설정</h2>

              {/* Discord Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-semibold text-black">
                    디스코드 채널 자동 생성
                  </p>
                  <p className="text-sm font-medium text-[#808080]">
                    참가자 전용 비공개 채널을 만듭니다.
                  </p>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => setDiscordEnabled(!discordEnabled)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                    discordEnabled ? "bg-[#60198a]" : "bg-[#ccc]"
                  }`}
                  aria-label="디스코드 채널 자동 생성"
                >
                  <span
                    className={`${
                      discordEnabled ? "translate-x-7" : "translate-x-1"
                    } inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform`}
                  />
                </button>
              </div>
            </div>

            {/* Participant Information Collection Section */}
            <div className="bg-white border border-[#d9d9d9] rounded-xl p-6 flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-black">
                참가자 정보 수집
              </h2>

              {/* Participant Fields */}
              <div className="flex flex-col gap-3">
                {participantFields.map((field) => (
                  <div
                    key={field.id}
                    className="bg-[#fdfdfd] border border-[#e9e9e9] rounded-xl p-4 flex flex-col items-center justify-center min-h-[64px]"
                  >
                    <p className="text-xs font-semibold text-[#808080]">
                      {field.subtitle}
                    </p>
                    <p className="text-lg font-semibold text-[#090909]">
                      {field.label}
                    </p>
                  </div>
                ))}

                {/* Add Question Button */}
                <button
                  onClick={handleAddQuestion}
                  className="flex items-center justify-center gap-2 h-14 border-2 border-dashed border-[#afafaf] rounded-xl text-[#7b419e] font-semibold text-base hover:bg-[#f5f0f7] transition-colors"
                >
                  <span>+</span>
                  <span>질문 추가하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button (Fixed at bottom) */}
        <div className="fixed bottom-[70px] left-0 right-0 px-4 py-3 bg-white border-t border-[#e9e9e9]">
          <GradientButton onClick={handleCreateEvent}>
            행사 생성하기
          </GradientButton>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomBar activeItem="home" />
    </div>
  );
}
