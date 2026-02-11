import Calendar from "react-calendar";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Calendar />

      <button
        className="mt-4 px-4 py-2 bg-black text-white rounded"
        onClick={() => setOpen(true)}
      >
        열기
      </button>

      {/* Dim */}
      {open && (
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={`
          absolute bottom-0 left-0 w-full
          bg-white rounded-t-2xl shadow-xl
          transform transition-transform duration-300
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ height: "60%" }}
      >
        <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
        <div className="p-4 text-left">
          내용
        </div>
      </div>
    </div>
  );
}
