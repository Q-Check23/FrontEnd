import { useState } from "react";
import { checkNicknameAvailability } from "../../api/auth";
import { useToastStore } from "../../stores/useToastStore";

export default function Login() {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [emailId, setEmailId] = useState("");
  const [domain, setDomain] = useState("gmail.com");
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [checkedNickname, setCheckedNickname] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState("idle");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const toast = useToastStore();

  const domains = ["직접입력", "gmail.com", "naver.com", "daum.net", "kakao.com"];

  const isCustomDomain = domain === "직접입력";
  const [customDomain, setCustomDomain] = useState("");

  const finalEmail = `${emailId}@${isCustomDomain? customDomain : domain}`;

  const isFormValid =
    name.trim().length > 0 &&
    nickname.trim().length > 0 &&
    emailId.trim().length > 0 &&
    (isCustomDomain ? customDomain.trim().length > 0 : true);

  const isNicknameAvailable =
    nicknameStatus === "available" && checkedNickname === nickname.trim();

  const resetNicknameCheck = (nextNickname) => {
    setNickname(nextNickname);
    if (nextNickname.trim() !== checkedNickname) {
      setNicknameStatus("idle");
      setNicknameMessage("");
    }
  };

  const handleNicknameCheck = async () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setNicknameStatus("error");
      setNicknameMessage("닉네임을 먼저 입력해주세요.");
      return;
    }

    setIsCheckingNickname(true);
    setNicknameStatus("idle");
    setNicknameMessage("");

    try {
      const response = await checkNicknameAvailability(trimmedNickname);
      setCheckedNickname(trimmedNickname);

      if (response.available) {
        setNicknameStatus("available");
        setNicknameMessage("사용 가능한 닉네임입니다.");
        toast?.push("닉네임을 사용할 수 있습니다.");
        return;
      }

      setNicknameStatus("taken");
      setNicknameMessage("이미 사용 중인 닉네임입니다.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "닉네임 확인에 실패했습니다.";
      setNicknameStatus("error");
      setNicknameMessage(message);
      toast?.push(message);
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    if (!isNicknameAvailable) {
      toast?.push("회원가입 전 닉네임 중복 확인이 필요합니다.");
      return;
    }

    toast?.push("Discord OAuth 연동 전까지는 회원가입 완료를 진행할 수 없습니다.");
    console.log({ name, nickname, finalEmail });
  };

  const nicknameMessageColor =
    nicknameStatus === "available"
      ? "text-[#009a49]"
      : nicknameStatus === "taken" || nicknameStatus === "error"
        ? "text-[#d93025]"
        : "text-gray-500";

  return (
    <div className="h-full w-full flex flex-col items-center justify-start gap-16">
        <div className="self-start mt-10 ml-10">
          <h1 className="text-2xl font-bold">회원가입</h1>
          <p className="mt-2 text-sm text-gray-500">
            현재는 닉네임 중복 확인만 먼저 연동되어 있습니다.
          </p>
        </div>
      
      <div className="h-full w-full flex flex-col p-5">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {/* 이름 */}
          <div>
            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="성명"
            className="w-full h-11 rounded-xl border border-gray-200 outline-none focus:border-gray-400 p-5"
            />
            <p className="text-xs text-gray-500 text-left pl-3 pt-2">정산시 사용되니 실명으로 입력해주세요.</p>
          </div>

          {/* 닉네임 */}
           <div>
            <div className="flex items-center gap-2">
              <input
                value={nickname}
                onChange={(e) => resetNicknameCheck(e.target.value)}
                placeholder="닉네임"
                className="flex-1 h-11 rounded-xl border border-gray-200 outline-none focus:border-gray-400 px-5"
              />
              <button
                type="button"
                onClick={handleNicknameCheck}
                disabled={isCheckingNickname}
                className="shrink-0 h-11 rounded-xl border border-gray-900 px-4 text-sm font-medium text-gray-900 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
              >
                {isCheckingNickname ? "확인 중" : "중복 확인"}
              </button>
            </div>
            <p className={`text-xs text-left pl-3 pt-2 ${nicknameMessageColor}`}>
              {nicknameMessage || "회원가입 전 닉네임 중복 확인을 진행해주세요."}
            </p>
          </div>

          {/* 이메일 */}
          <div className="flex items-center gap-3 w-full">
            <input
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="이메일 주소"
              className="w-1/2 h-11 rounded-xl border border-gray-200 px-4 outline-none focus:border-gray-400"
            />

            <span className="shrink-0 text-gray-700 font-medium">@</span>

            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-1/2 h-11 rounded-xl border border-gray-200 px-4 outline-none focus:border-gray-400 bg-white"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 도메인 직접 입력인 경우 */}
            {isCustomDomain && (
              <input value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="도메인 직접 입력"
              className="w-full h-11 rounded-xl border border-gray-200 outline-none focus:border-gray-400 p-5"/>
              
            )}
          {/* 가입 버튼 */}
          <button type="submit"
          disabled = {!isFormValid}
          className={["w-full h-11 rounded-xl border outline-none", isFormValid ? "bg-gray-900 text-white cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"].join(" ")}>
            OAuth 연동 후 가입 가능
          </button>
        </form>
      </div>
    </div>
    
  );
}
