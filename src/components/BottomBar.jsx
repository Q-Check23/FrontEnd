import { useNavigate } from "react-router-dom"
import home from "../assets/svg/Home.svg"
import meeting from "../assets/svg/Network.svg"
import profile from "../assets/svg/Person.svg"

export default function BottomBar() {

  const navigate = useNavigate()

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
        <img src={home} className="w-6 h-6" />
        <span className="text-xs mt-1">홈</span>
      </div>

      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate("/event-manage")}
      >
        <img src={meeting} className="w-6 h-6" />
        <span className="text-xs mt-1">모임</span>
      </div>

      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        <img src={profile} className="w-6 h-6" />
        <span className="text-xs mt-1">Q</span>
      </div>

    </div>
  )
}