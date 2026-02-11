import Calendar from "react-calendar";
import { useState } from "react";
import chevronUp from "../../assets/svg/ChevronUp.svg"

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 캘린더 */}
      <div className="border border-gray-300 rounded-2xl p-6 h-[40%]">
        <Calendar className="h-full w-full custom-calendar" calendarType="gregory"/>
      </div>
      

      {/* divider */}
      <div className="my-6 px-3">
        <div className="h-px bg-gray-200" />
      </div>


      {/* 이벤트 목록 */}


      {/* 바텀시트 버튼 */}
      <button onClick={() => setOpen(true)}>
        <img src={chevronUp} alt="chvUp"></img>
      </button>

      {/* Dim */}
      {open && (
        <div
          className="absolute inset-0 bg-black/20 rounded-2xl"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 바텀시트 열렸을때 */}
      <div
        className={`
          absolute bottom-0 left-0 w-full
          bg-white rounded-t-2xl shadow-xl
          transform transition-transform duration-300
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ height: "70%" }}
      >
        <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
        <div className="p-4 text-left">
          내용
        </div>
      </div>
    </div>
  );
}
