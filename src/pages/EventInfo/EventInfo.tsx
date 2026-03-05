import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomBar from "../../components/BottomBar";

interface EventInfoData {
  eventName: string;
  date: string;
  location: string;
  attendeeCount: string;
  description: string;
  organizerName: string;
  organizerRole: string;
}

export default function EventInfo() {
  const navigate = useNavigate();
  const [attending, setAttending] = useState(true);

  // Mock event data
  const eventData: EventInfoData = {
    eventName: "정기 데모데이 & 네트워킹",
    date: "12월 03일 (화) 19:00",
    location: "광개토관 101호",
    attendeeCount: "42명 참여 중",
    description: `안녕하세요, KUIT 운영진입니다.
드디어 이번 학기 활동의 꽃, 데모데이가 열립니다!

각 팀이 한 학기 동안 열심히 준비한 프로젝트를 발표하는 자리입니다. 바쁘시더라도 꼭 참석하셔서 자리르 빛내주세요.

✅ 준비물: 개인 노트북, 열정
🍕 뒷풀이: 학교 앞 '주먹구구' (회비 별도)`,
    organizerName: "KUIT 운영진",
    organizerRole: "행사 주최자",
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: eventData.eventName,
        text: `${eventData.date} - ${eventData.location}`,
      });
    }
  };

  const handleNotAttending = () => {
    setAttending(false);
  };

  const handleViewQRCode = () => {
    // Navigate to QR code check-in page
    navigate("/check-in-qr");
  };

  return (
    <div className="relative w-full h-full bg-[#f9f9f9] flex flex-col overflow-y-auto">
      {/* Header Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-[#f9f9f9] z-10 flex items-center justify-between px-3 py-3">
        <button
          onClick={handleGoBack}
          className="text-2xl text-black hover:opacity-70 transition-opacity"
          aria-label="뒤로가기"
        >
          ‹
        </button>
        <button
          onClick={handleShare}
          className="text-xl text-black hover:opacity-70 transition-opacity"
          aria-label="공유"
        >
          ⋯
        </button>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-32 px-5">
        {/* D-DAY Badge */}
        <div className="mb-4">
          <div className="inline-block bg-gradient-to-r from-[#621783] to-[#ae29e9] rounded-full px-3 py-1">
            <span className="text-sm font-semibold text-white">D-DAY</span>
          </div>
        </div>

        {/* Event Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">KUIT</h1>
          <h2 className="text-3xl font-bold text-black">
            {eventData.eventName}
          </h2>
        </div>

        {/* Event Details */}
        <div className="space-y-4 mb-8">
          {/* Date */}
          <div className="flex items-start gap-3">
            <svg
              className="w-10 h-10 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#808080]">일시</p>
              <p className="text-base font-bold text-[#090909]">
                {eventData.date}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <svg
              className="w-10 h-10 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#808080]">장소</p>
              <p className="text-base font-bold text-[#090909]">
                {eventData.location}
              </p>
            </div>
          </div>

          {/* Attendee Count */}
          <div className="flex items-start gap-3">
            <svg
              className="w-10 h-10 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#808080]">참석 인원</p>
              <p className="text-base font-bold text-[#090909]">
                {eventData.attendeeCount}
              </p>
            </div>
          </div>
        </div>

        {/* Event Details Card */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          {/* Description Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-black mb-4">상세 내용</h3>
            <p className="text-base font-medium text-black whitespace-pre-wrap leading-relaxed">
              {eventData.description}
            </p>
          </div>

          {/* Divider */}
          <hr className="border-t border-[#e0e0e0] my-6" />

          {/* Organizer Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#870199] to-[#e101ff] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">K</span>
            </div>
            <div>
              <p className="text-lg font-bold text-[#090909]">
                {eventData.organizerName}
              </p>
              <p className="text-sm font-medium text-[#808080]">
                {eventData.organizerRole}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Buttons - Fixed */}
      <div className="fixed bottom-20 left-0 right-0 bg-white px-5 py-4 flex gap-3">
        <button
          onClick={handleNotAttending}
          className="flex-1 bg-white border-2 border-[#c9c9c9] rounded-lg py-3 font-bold text-base text-[#080808] hover:bg-[#f9f9f9] transition-colors"
        >
          불참
        </button>
        <button
          onClick={handleViewQRCode}
          className="flex-1 bg-gradient-to-r from-[#870199] to-[#e101ff] rounded-lg py-3 font-bold text-base text-white hover:opacity-90 transition-opacity"
        >
          입장 QR코드 보기
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomBar activeItem="activity" />
    </div>
  );
}
