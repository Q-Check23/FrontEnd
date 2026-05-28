import { useNavigate, useSearchParams } from "react-router-dom";

type TabKey = "notice" | "events" | "members";

interface GroupTabsProps {
  activeTab: TabKey;
}

const TABS: { key: TabKey; label: string; path: string }[] = [
  { key: "notice", label: "공지", path: "/group-notice" },
  { key: "events", label: "행사", path: "/group-events" },
  { key: "members", label: "멤버", path: "/group-members" },
];

export default function GroupTabs({ activeTab }: GroupTabsProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId") ?? "";

  return (
    <nav className="sticky top-14 z-40 bg-surface flex border-b border-outline-variant/30 px-5">
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => navigate(`${tab.path}?clubId=${clubId}`)}
            className={`flex-1 py-4 text-center text-sm transition-colors ${
              isActive
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
