import { useNavigate, useSearchParams } from "react-router-dom";

type TabKey = "qr" | "dashboard" | "participants";

interface EventManageTabsProps {
  activeTab: TabKey;
}

const TABS: { key: TabKey; label: string; path: string }[] = [
  { key: "qr", label: "등록 QR 정보", path: "/qr-info" },
  { key: "dashboard", label: "대시보드", path: "/dashboard" },
  { key: "participants", label: "참가자 목록", path: "/participants" },
];

export default function EventManageTabs({ activeTab }: EventManageTabsProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId") ?? "";

  return (
    <nav className="sticky top-14 z-40 bg-surface flex border-b border-outline-variant/30 px-5">
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => navigate(`${tab.path}?eventId=${eventId}`)}
            className={`flex-1 py-3 text-center text-sm transition-colors ${
              isActive
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-on-surface-variant/60 hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
