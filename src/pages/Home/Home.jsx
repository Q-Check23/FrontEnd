import Calendar from "react-calendar";
import { useState } from "react";
import chevronUp from "../../assets/svg/ChevronUp.svg";
import search from "../../assets/svg/Search.svg";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* 캘린더 */}
      <div className="border border-gray-300 rounded-2xl p-6 h-[40%]">
        <Calendar
          className="h-full w-full custom-calendar"
          calendarType="gregory"
        />
      </div>

      {/* divider */}
      <div className="my-6 px-3">
        <div className="h-px bg-gray-200" />
      </div>

       {/* !!! 데이터 연결 필요 !!!*/}
      {/* ===== 선택 날짜 이벤트 요약 ===== */}
      <div className="px-3 space-y-4 text-left">

        <div className="text-lg font-semibold">
          09/18 (수)
        </div>

         
        {/* 그룹 */}
        <div className="space-y-3" >

          {/* kuit */}
          <div>
            <span className="inline-block px-3 py-1 text-sm rounded-md bg-green-100 text-green-700">
              kuit
            </span>

            <ul className="mt-2 ml-2 text-sm text-gray-700 space-y-1">
              <li>• 서버 스터디</li>
              <li>• 웹 회식</li>
            </ul>
          </div>

          {/* gdg */}
          <div>
            <span className="inline-block px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-700">
              gdg
            </span>

            <ul className="mt-2 ml-2 text-sm text-gray-700 space-y-1">
              <li>• 세션</li>
            </ul>
          </div>

        </div>

      </div>

      

      {/* Dim */}
      {open && (
        <div
          className="absolute inset-0 bg-black/20 rounded-2xl"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ===== 바텀시트 ===== */}
      <div
        className={`
          absolute bottom-0 left-0 w-full
          bg-[#F4EBFF] rounded-t-2xl
          transform transition-transform duration-300
          ${open ? "translate-y-0" : "translate-y-[60%]"}
        `}
        style={{ height: "70%" }}
      >

        {/* handle */}
        <button
          className="flex justify-center w-full mt-3"
          onClick={() => setOpen(true)}
        >
          <img src={chevronUp} alt="chvUp" />
        </button>

        <div className="px-4 space-y-4">

          {/* 검색 */}
          <div className="relative pt-3">
            <input
              placeholder="이벤트 검색"
              className="w-full rounded-full border border-purple-200 px-4 py-3 pr-12 text-sm focus:outline-none"
            />

            <img
              src={search}
              alt="search"
              className="absolute right-4 top-2/3 -translate-y-1/2 w-5 h-5"
            />

          </div>
          {/* 필터 */}
          <button className="text-sm bg-white border px-3 py-1 rounded-md shadow-sm">
            기간
          </button>

          {/* 이벤트 카드 리스트 */}
          <div className="space-y-3 mt-2">

            {[1,2,3].map((i)=>(
              <div
                key={i}
                className="bg-white border border-purple-200 rounded-xl p-4 shadow-sm"
              >

                <div className="font-semibold text-gray-800">
                  웹 회식
                </div>

                <div className="text-sm text-gray-500 mt-1">
                  kuit
                </div>

                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>📍 주먹구구</span>
                  <span>2025.11.27</span>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}