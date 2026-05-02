import { useNavigate } from "react-router-dom"
import home from "../assets/svg/Home.svg"
import meeting from "../assets/svg/Network.svg"
import profile from "../assets/svg/Person.svg"

export default function BottomBar({
  activeItem,
}: {
  activeItem?: "home" | "moim" | "profile" | "activity";
}) {

  const navigate = useNavigate()
  const isMeetingActive = activeItem === "moim" || activeItem === "activity"

  return (
    <div className="
      absolute bottom-0 left-0
      w-full
      bg-[#F4EBFF]
      py-3
      flex justify-around items-center
    ">

      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <img src={home} className="w-6 h-6" style={{ opacity: activeItem === "home" ? 1 : 0.4 }} />
        <span className="text-xs mt-1" style={{ color: activeItem === "home" ? "#702f95" : "#888888", fontWeight: activeItem === "home" ? 600 : 400 }}>홈</span>
      </div>

      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate("/group-detail")}
      >
        <img src={meeting} className="w-6 h-6" style={{ opacity: isMeetingActive ? 1 : 0.4 }} />
        <span className="text-xs mt-1" style={{ color: isMeetingActive ? "#702f95" : "#888888", fontWeight: isMeetingActive ? 600 : 400 }}>모임</span>
      </div>

      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        <img src={profile} className="w-6 h-6" style={{ opacity: activeItem === "profile" ? 1 : 0.4 }} />
        <span className="text-xs mt-1" style={{ color: activeItem === "profile" ? "#702f95" : "#888888", fontWeight: activeItem === "profile" ? 600 : 400 }}>Q</span>
      </div>

    </div>
  )
}
