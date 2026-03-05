import { Outlet } from "react-router-dom"
import BottomBar from "./BottomBar"

export default function Layout() {

  return (
    <div className="relative min-h-screen pb-20">

      {/* 페이지 영역 */}
      <Outlet />

      {/* 하단바 */}
      <BottomBar />

    </div>
  )
}