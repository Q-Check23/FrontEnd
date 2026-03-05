import { useNavigate } from "react-router-dom"
import home from "../assets/svg/Home.svg"
import activity from "../assets/svg/Network.svg"
import user from "../assets/svg/Person.svg"

export default function BottomBar() {

  const navigate = useNavigate()

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#EDE6F4] py-3 flex justify-around items-center">

      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <img src={home} className="w-6 h-6" />
        <span className="text-xs mt-1">홈</span>
      </div>

      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate("/meeting")}
      >
        <img src={activity} className="w-6 h-6" />
        <span className="text-xs mt-1">모임</span>
      </div>

      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        <img src={user} className="w-6 h-6" />
        <span className="text-xs mt-1">Q</span>
      </div>

    </div>
  )
}