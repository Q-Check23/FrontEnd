import { useNavigate } from "react-router-dom";

type EventManageTab = "qr" | "dashboard" | "participants";

const TAB_CONFIG: Record<
  EventManageTab,
  { label: string; path: string }
> = {
  qr: {
    label: "등록 QR 정보",
    path: "/qr-info",
  },
  dashboard: {
    label: "대시보드",
    path: "/dashboard",
  },
  participants: {
    label: "참가자 목록",
    path: "/participants",
  },
};

export default function EventManageTabs({
  activeTab,
}: {
  activeTab: EventManageTab;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center border-y border-[#c0c0c0] bg-white">
      {(Object.keys(TAB_CONFIG) as EventManageTab[]).map((tabKey) => {
        const tab = TAB_CONFIG[tabKey];
        const isActive = activeTab === tabKey;

        return (
          <button
            key={tabKey}
            type="button"
            onClick={() => navigate(tab.path)}
            className={`flex-1 border-b px-4 py-3 text-center text-base font-medium transition-colors ${
              isActive
                ? "border-[#649f76] text-[#649f76]"
                : "border-transparent text-black"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
