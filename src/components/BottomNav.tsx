import { Link, useLocation } from "react-router-dom";

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: "/home", icon: "home", label: "Home" },
  { path: "/meeting", icon: "groups", label: "Meetings" },
  { path: "/profile", icon: "person", label: "My Page" },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.04)]">
      <div className="flex justify-around items-center h-20 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center rounded-full px-4 py-2 transition-colors active:scale-90 ${
                isActive
                  ? "text-primary font-bold"
                  : "text-on-surface-variant hover:bg-primary/5"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
