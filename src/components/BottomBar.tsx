import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../assets/svg/Home.svg";
import ActivityIcon from "../assets/svg/Activity.svg";
import MeIcon from "../assets/svg/Me.svg";

type NavigationItem = {
  id: string;
  label: string;
  path: string;
  icon: string;
};

type BottomBarProps = {
  activeItem?: string;
  onNavigate?: (path: string) => void;
};

export default function BottomBar({
  activeItem = "home",
  onNavigate,
}: BottomBarProps) {
  const navigate = useNavigate();
  const [active, setActive] = useState(activeItem);

  const navigationItems: NavigationItem[] = [
    {
      id: "home",
      label: "홈",
      path: "/home",
      icon: HomeIcon,
    },
    {
      id: "activity",
      label: "모임",
      path: "/activity",
      icon: ActivityIcon,
    },
    {
      id: "profile",
      label: "Q",
      path: "/profile",
      icon: MeIcon,
    },
  ];

  const handleNavigate = (item: NavigationItem) => {
    setActive(item.id);
    if (onNavigate) {
      onNavigate(item.path);
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav
      className="absolute bg-[rgba(255,246,246,0.6)] border-t border-[#d3d3d3] flex items-center justify-center w-full bottom-0"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex flex-row w-full justify-center items-center gap-0">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item)}
            className={[
              "flex flex-1 flex-col gap-1 py-1.5 items-center justify-center",
              "transition-colors duration-200",
              active === item.id
                ? "bg-[#e8def8] rounded-[16px]"
                : "hover:bg-[rgba(232,222,248,0.3)]",
            ].join(" ")}
            aria-label={item.label}
            aria-current={active === item.id ? "page" : undefined}
          >
            {/* Icon Container */}
            <div
              className={[
                "flex items-center justify-center w-14 h-8 rounded-[16px]",
                active === item.id ? "text-[#625b71]" : "text-[#49454f]",
              ].join(" ")}
            >
              <img 
                src={item.icon} 
                alt={item.label}
                className="w-6 h-6"
              />
            </div>

            {/* Label */}
            <p
              className={[
                "font-medium text-xs text-center tracking-[0.5px]",
                "leading-4 w-full",
                active === item.id ? "text-[#625b71]" : "text-[#49454f]",
              ].join(" ")}
              style={{
                fontVariationSettings: "'wdth' 100",
                fontFamily:
                  "Roboto, system-ui, -apple-system, Segoe UI, sans-serif",
              }}
            >
              {item.label}
            </p>
          </button>
        ))}
      </div>
    </nav>
  );
}
