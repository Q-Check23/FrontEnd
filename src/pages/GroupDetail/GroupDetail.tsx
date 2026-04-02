import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomBar from "../../components/BottomBar";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Notice {
  id: string;
  authorAvatar: string;
  authorName: string;
  authorRole: string;
  eventName: string;
}

interface Event {
  id: string;
  category: string;
  date: string;
  title: string;
  time: string;
  location: string;
}

interface Member {
  id: string;
  avatar: string;
  name: string;
  role: string;
  joinDate: string;
  isActive: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const notices: Notice[] = [
  { id: "1", authorAvatar: "정", authorName: "정윤아", authorRole: "운영진", eventName: "KUIT 6기 데모데이 🍀" },
  { id: "2", authorAvatar: "정", authorName: "정윤아", authorRole: "운영진", eventName: "KUIT 6기 데모데이 🍀" },
  { id: "3", authorAvatar: "정", authorName: "정윤아", authorRole: "운영진", eventName: "KUIT 6기 데모데이 🍀" },
  { id: "4", authorAvatar: "정", authorName: "정윤아", authorRole: "운영진", eventName: "KUIT 6기 데모데이 🍀" },
  { id: "5", authorAvatar: "정", authorName: "정윤아", authorRole: "운영진", eventName: "KUIT 6기 데모데이 🍀" },
];

const events: Event[] = [
  { id: "1", category: "스터디", date: "09/18", title: "서버 스터디", time: "19:00", location: "강남역 스터디카페" },
  { id: "2", category: "스터디", date: "09/18", title: "서버 스터디", time: "19:00", location: "강남역 스터디카페" },
];

const members: Member[] = [
  { id: "1", avatar: "", name: "김민우", role: "운영진", joinDate: "2021.03 가입", isActive: true },
  { id: "2", avatar: "", name: "김민우", role: "운영진", joinDate: "2021.03 가입", isActive: true },
  { id: "3", avatar: "", name: "김민우", role: "운영진", joinDate: "2021.03 가입", isActive: true },
  { id: "4", avatar: "", name: "김민우", role: "운영진", joinDate: "2021.03 가입", isActive: true },
  { id: "5", avatar: "", name: "김민우", role: "운영진", joinDate: "2021.03 가입", isActive: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const NoticeItem = ({ notice }: { notice: Notice }) => (
  <div
    className="mx-4 mb-3 bg-white rounded-2xl border border-[#e8e8e8] flex items-center gap-4 px-5 py-5"
    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
  >
    {/* 아바타: 피그마처럼 크고 회색 원, 글자는 어두운 회색 */}
    <div
      className="rounded-full bg-[#d9d9d9] flex items-center justify-center flex-shrink-0"
      style={{ width: 60, height: 60, fontSize: 20, fontWeight: 500, color: "#000000" }}
    >
      {notice.authorAvatar}
    </div>

    {/* 텍스트 영역 */}
    <div className="flex-1 min-w-0">
      {/* 이름 + 역할: 나란히, 이름 굵게 / 역할 회색 */}
      <div className="flex items-center gap-2 mb-1.5">
        <span style={{ fontSize: 15, fontWeight: 700, color: "#111111" }}>{notice.authorName}</span>
        <span style={{ fontSize: 13, fontWeight: 400, color: "#9ca3af" }}>{notice.authorRole}</span>
      </div>
      {/* 이벤트명: 굵게, 검정 */}
      <p style={{ fontSize: 15, fontWeight: 700, color: "#111111" }} className="truncate text-left">
        {notice.eventName}
      </p>
    </div>
  </div>
);

const EventItem = ({ event, onJoin }: { event: Event; onJoin: () => void }) => (
  <div className="bg-white rounded-xl border border-[#f0f0f0] p-6 mb-3">
    <div className="flex items-center gap-2 mb-3">
      <span className="px-2 py-0.5 bg-[#e5e0f8] text-[#702f95] text-xs font-bold rounded-full">
        {event.category}
      </span>
      <span className="text-xs text-[#808080]">{event.date}</span>
    </div>
    <h3 className="text-lg font-bold text-black mb-2 text-left">{event.title}</h3>
    <div className="flex items-center gap-3 text-sm text-[#808080] mb-3">
      <div className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {event.time}
      </div>
      <div className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {event.location}
      </div>
    </div>
    <div className="flex justify-end">
      <button
        onClick={onJoin}
        className="px-5 py-2 bg-[#702f95] text-white text-sm font-bold rounded-full hover:bg-[#5a2478] transition-colors"
      >
        참여하기
      </button>
    </div>
  </div>
);

const MemberItem = ({ member }: { member: Member }) => (
  <div
    className="mx-4 mb-3 bg-white rounded-2xl border border-[#e8e8e8] flex items-center gap-4 px-5 py-4"
    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
  >
    {/* 아바타 */}
    <div className="w-14 h-14 rounded-full bg-[#d9d9d9] flex-shrink-0" />

    {/* 이름 + 역할 뱃지 + 가입일 */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span style={{ fontSize: 15, fontWeight: 700, color: "#111111" }}>{member.name}</span>
        <span
          className="px-2 py-0.5 rounded-md"
          style={{ fontSize: 12, fontWeight: 500, color: "#702f95", background: "#ede8f8" }}
        >
          {member.role}
        </span>
      </div>
      <p className="text-left" style={{ fontSize: 13, color: "#9ca3af" }}>{member.role} · {member.joinDate}</p>
    </div>

    {/* 활동 상태 */}
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <div className={`w-2 h-2 rounded-full ${member.isActive ? "bg-[#00c853]" : "bg-[#d9d9d9]"}`} />
      <span style={{ fontSize: 13, fontWeight: 500, color: member.isActive ? "#00c853" : "#808080" }}>
        {member.isActive ? "활동중" : "비활동"}
      </span>
    </div>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

type Tab = "공지" | "행사" | "멤버";

export default function GroupDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("공지");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: Tab[] = ["공지", "행사", "멤버"];

  const handleJoin = (eventId: string) => {
    console.log("join event:", eventId);
  };

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: "#f7f7f7" }}>
      {/* Header */}
      <div className="bg-white px-5 pt-5 pb-0 border-b border-[#f0f0f0]">
        <h1 className="text-xl font-bold text-black mb-4">KUIT</h1>

        {/* Tabs */}
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-bold transition-colors border-b-2 ${
                activeTab === tab
                  ? "text-[#702f95] border-[#702f95]"
                  : "text-[#808080] border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">

        {/* ── 공지 탭 ── */}
        {activeTab === "공지" && (
          <div className="pt-4">
            {notices.map((notice) => (
              <NoticeItem key={notice.id} notice={notice} />
            ))}
          </div>
        )}

        {/* ── 행사 탭 ── */}
        {activeTab === "행사" && (
          <div className="px-4 pt-4">
            <div className="flex items-center bg-[#e8e8e8] rounded-xl px-4 py-2.5 mb-5">
              <input
                type="text"
                placeholder="이벤트 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-black outline-none placeholder:text-[#666666]"
              />
              <svg className="w-5 h-5 text-[#808080]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-black">다가오는 이벤트</h2>
              <button className="text-sm text-[#702f95] font-medium">전체보기</button>
            </div>
            {events
              .filter((e) =>
                searchQuery === "" || e.title.includes(searchQuery) || e.location.includes(searchQuery)
              )
              .map((event) => (
                <EventItem key={event.id} event={event} onJoin={() => handleJoin(event.id)} />
              ))}
          </div>
        )}

        {/* ── 멤버 탭 ── */}
        {activeTab === "멤버" && (
          <div className="bg-white">
            <div className="px-4 py-3 border-b border-[#f0f0f0]">
              <button
                onClick={() => navigate("/event-manage")}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#f5f0fa] rounded-xl text-sm font-bold text-[#702f95]"
              >
                <span>모임 관리 바로가기</span>
                <span>&gt;</span>
              </button>
            </div>
            {members.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomBar activeItem="moim" />
    </div>
  );
}