import { useNavigate } from "react-router-dom";
import BottomBar from "../../components/BottomBar";

// ─── Types ───────────────────────────────────────────────────────────────────

interface MenuItemProps {
  label: string;
  onClick?: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const MenuItem = ({ label, onClick }: MenuItemProps) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-4 py-4 border-b border-[#f0f0f0] last:border-b-0 hover:bg-[#faf9ff] transition-colors"
  >
    <div className="flex items-center gap-3">
      {/* 아이콘 */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "#f0ebfa" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#702f95" strokeWidth="1.8">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <polyline points="2,4 12,13 22,4" />
        </svg>
      </div>
      <span style={{ fontSize: 15, fontWeight: 500, color: "#111111" }}>{label}</span>
    </div>
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
      <path d="M1 1l5 5-5 5" stroke="#c0c0c0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "프로필 수정" },
    { label: "참여한 행사" },
    { label: "알림 설정" },
    { label: "비밀번호 변경" },
    { label: "도움말" },
    { label: "앱 정보" },
  ];

  return (
    <div className="relative w-full h-full flex flex-col overflow-y-auto" style={{ background: "#f5f5f5" }}>

      {/* ── 헤더 ── */}
      <div className="bg-white px-5 pt-5 pb-4 flex items-center justify-between flex-shrink-0">
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111111" }}>내 정보</h1>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* ── 프로필 카드 ── */}
      <div className="mx-4 mt-4 rounded-3xl overflow-hidden flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #5a1f7a 0%, #702f95 40%, #9b4fc4 100%)",
        }}
      >
        {/* 상단: 아바타 + 이름/뱃지/가입일 */}
        <div className="flex items-center gap-4 px-5 pt-5 pb-4">
          {/* 아바타 */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* 이름 + 뱃지 + 가입일 */}
          <div>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#ffffff", letterSpacing: "0.08em", marginBottom: 6 }}>
              홍 길 동
            </p>
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full"
                style={{ fontSize: 12, fontWeight: 500, color: "#ffffff", background: "rgba(255,255,255,0.25)" }}
              >
                참가자
              </span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>2024.01 가입</span>
            </div>
          </div>
        </div>

        {/* 하단: 통계 */}
        <div className="flex gap-3 px-5 pb-5">
          <div
            className="flex-1 rounded-2xl px-4 py-3"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            <p style={{ fontSize: 28, fontWeight: 700, color: "#ffffff", marginBottom: 2 }}>12</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", letterSpacing: "0.05em" }}>참 여 한 행 사</p>
          </div>
          <div
            className="flex-1 rounded-2xl px-4 py-3"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            <p style={{ fontSize: 28, fontWeight: 700, color: "#ffffff", marginBottom: 2 }}>3</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", letterSpacing: "0.05em" }}>예 정 된 행 사</p>
          </div>
        </div>
      </div>

      {/* ── 연락처 정보 ── */}
      <div className="mx-4 mt-4 bg-white rounded-2xl px-4 py-4 flex-shrink-0"
        style={{ border: "1px solid #eeeeee", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
      >
        <p style={{ fontSize: 14, fontWeight: 600, color: "#111111", marginBottom: 12 }}>연 락 처 정 보</p>

        {/* 이메일 */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#f0ebfa" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#702f95" strokeWidth="1.8">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <polyline points="2,4 12,13 22,4" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 1 }}>이메일</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#111111" }}>hong@example.com</p>
          </div>
        </div>

        {/* 전화번호 */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#f0ebfa" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#702f95" strokeWidth="1.8">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.79a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 1 }}>전화번호</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#111111" }}>010-1234-5678</p>
          </div>
        </div>
      </div>

      {/* ── 메뉴 목록 ── */}
      <div className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden flex-shrink-0"
        style={{ border: "1px solid #eeeeee", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.label} label={item.label} />
        ))}
      </div>

      {/* ── 로그아웃 ── */}
      <div className="mx-4 mt-4 mb-24 flex-shrink-0">
        <button
          className="w-full py-4 bg-white rounded-2xl hover:bg-[#fff0f0] transition-colors"
          style={{
            border: "1px solid #eeeeee",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            fontSize: 15,
            fontWeight: 600,
            color: "#e53935",
          }}
        >
          로그아웃
        </button>
      </div>
    
    </div>
  );
}