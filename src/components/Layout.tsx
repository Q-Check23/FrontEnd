import { Outlet } from "react-router-dom";
import { useMyProfile } from "../hooks";
import BottomNav from "./BottomNav";

export default function Layout() {
  // Layout 진입 시 프로필 prefetch
  useMyProfile();

  return (
    <div className="relative h-full bg-surface overflow-y-auto">
      <Outlet />
      <BottomNav />
    </div>
  );
}
