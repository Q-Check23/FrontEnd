import { useState } from "react";

interface ParticipantRegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, phone: string) => void;
}

export default function ParticipantRegister({
  isOpen,
  onClose,
  onSubmit,
}: ParticipantRegisterProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
    setPhone(value);
  };

  const handleSubmit = () => {
    setError("");

    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    if (phone.length !== 4) {
      setError("전화번호 마지막 4자리를 입력해주세요.");
      return;
    }

    onSubmit(name, phone);
    setName("");
    setPhone("");
  };

  const handleCancel = () => {
    setName("");
    setPhone("");
    setError("");
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
        {/* Header */}
        <h1 className="text-2xl font-bold text-black text-center mb-2">
          참가자 직접 등록
        </h1>

        {/* Subtitle */}
        <p className="text-sm font-medium text-[#808080] text-center mb-6">
          정보를 입력하여 임장 처리합니다.
        </p>

        {/* Name Input */}
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요 (예: 홍길동)"
            className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-base font-medium text-[#080808] placeholder:text-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Phone Input */}
        <div className="mb-6">
          <input
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="전화번호 숫자 4자리"
            maxLength={4}
            className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg text-base font-medium text-[#080808] placeholder:text-[#c0c0c0] focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600 font-medium mb-4 text-center">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <div className="mb-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-[#870199] to-[#e101ff] hover:opacity-90 transition-opacity h-12 rounded-full font-bold text-base text-white flex items-center justify-center"
          >
            입장 처리
          </button>
        </div>

        {/* Cancel Link */}
        <button
          onClick={handleCancel}
          className="w-full text-center text-[#808080] text-sm font-medium hover:text-black transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
}
