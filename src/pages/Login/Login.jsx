import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkUsernameAvailability, signup } from "../../api/auth";
import { useToastStore } from "../../stores/useToastStore";
import { useUserStore } from "../../stores/useUserStore";
import { SIGNUP_TOKEN_STORAGE_KEY } from "../AuthCallback/AuthCallback";
import { consumeAuthNext } from "../../lib/authRedirect";

export default function Login() {
  const navigate = useNavigate();
  const [signupToken, setSignupToken] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [emailId, setEmailId] = useState("");
  const [domain, setDomain] = useState("gmail.com");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkedUsername, setCheckedUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const [usernameMessage, setUsernameMessage] = useState("");
  const pushToast = useToastStore((state) => state.push);
  const setAccessToken = useUserStore((state) => state.setAccessToken);

  useEffect(() => {
    const token = sessionStorage.getItem(SIGNUP_TOKEN_STORAGE_KEY);
    if (!token) {
      pushToast("Discord 로그인 이후에 회원가입을 진행해주세요.");
      navigate("/login-landing", { replace: true });
      return;
    }
    setSignupToken(token);
  }, [navigate, pushToast]);

  const domains = ["직접입력", "gmail.com", "naver.com", "daum.net", "kakao.com"];

  const isCustomDomain = domain === "직접입력";
  const [customDomain, setCustomDomain] = useState("");

  const finalEmail = `${emailId}@${isCustomDomain ? customDomain : domain}`;

  const isFormValid =
    name.trim().length > 0 &&
    username.trim().length > 0 &&
    phone.trim().length > 0 &&
    emailId.trim().length > 0 &&
    (isCustomDomain ? customDomain.trim().length > 0 : true);

  const isUsernameAvailable =
    usernameStatus === "available" && checkedUsername === username.trim();

  const resetUsernameCheck = (nextUsername) => {
    setUsername(nextUsername);
    if (nextUsername.trim() !== checkedUsername) {
      setUsernameStatus("idle");
      setUsernameMessage("");
    }
  };

  const handleUsernameCheck = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setUsernameStatus("error");
      setUsernameMessage("아이디를 먼저 입력해주세요.");
      return;
    }

    setIsCheckingUsername(true);
    setUsernameStatus("idle");
    setUsernameMessage("");

    try {
      const response = await checkUsernameAvailability(trimmedUsername);
      setCheckedUsername(trimmedUsername);

      if (response.available) {
        setUsernameStatus("available");
        setUsernameMessage("사용 가능한 아이디입니다.");
        pushToast("아이디를 사용할 수 있어요", "success");
        return;
      }

      setUsernameStatus("taken");
      setUsernameMessage("이미 사용 중인 아이디입니다.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "아이디 확인에 실패했습니다.";
      setUsernameStatus("error");
      setUsernameMessage(message);
      pushToast(message, "error");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    if (!isUsernameAvailable) {
      pushToast("회원가입 전 아이디 중복 확인이 필요합니다.");
      return;
    }

    if (!signupToken) {
      pushToast("Discord 로그인 이후에 회원가입을 진행해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await signup(
        {
          name: name.trim(),
          username: username.trim(),
          email: finalEmail,
          phone: phone.trim(),
        },
        signupToken,
      );
      setAccessToken(response.accessToken);
      sessionStorage.removeItem(SIGNUP_TOKEN_STORAGE_KEY);
      pushToast("회원가입이 완료되었습니다.");
      const next = consumeAuthNext();
      navigate(next ?? "/home", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "회원가입에 실패했습니다.";
      pushToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const usernameMessageColor =
    usernameStatus === "available"
      ? "text-[#009a49]"
      : usernameStatus === "taken" || usernameStatus === "error"
        ? "text-[#d93025]"
        : "text-gray-500";

  return (
    <div className="h-full w-full overflow-y-auto px-5 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">회원가입</h1>
        <p className="mt-2 text-sm text-gray-500">
          Discord 인증 후 추가 정보를 입력해주세요.
        </p>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* 이름 */}
        <div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="성명"
            className="w-full h-11 rounded-xl border border-gray-200 outline-none focus:border-gray-400 px-4"
          />
          <p className="text-xs text-gray-500 text-left pl-3 pt-2">
            정산시 사용되니 실명으로 입력해주세요.
          </p>
        </div>

        {/* 아이디 */}
        <div>
          <div className="flex items-center gap-2">
            <input
              value={username}
              onChange={(e) => resetUsernameCheck(e.target.value)}
              placeholder="아이디"
              className="flex-1 min-w-0 h-11 rounded-xl border border-gray-200 outline-none focus:border-gray-400 px-4"
            />
            <button
              type="button"
              onClick={handleUsernameCheck}
              disabled={isCheckingUsername}
              className="shrink-0 h-11 rounded-xl border border-gray-900 px-3 text-sm font-medium text-gray-900 whitespace-nowrap disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
            >
              {isCheckingUsername ? "확인 중" : "중복 확인"}
            </button>
          </div>
          <p className={`text-xs text-left pl-3 pt-2 ${usernameMessageColor}`}>
            {usernameMessage || "회원가입 전 아이디 중복 확인을 진행해주세요."}
          </p>
        </div>

        {/* 휴대폰 번호 */}
        <div>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="휴대폰 번호 (예: 010-1234-5678)"
            inputMode="tel"
            autoComplete="tel"
            className="w-full h-11 rounded-xl border border-gray-200 outline-none focus:border-gray-400 px-4"
          />
          <p className="text-xs text-gray-500 text-left pl-3 pt-2">
            행사 사전등록 시 자동으로 채워집니다.
          </p>
        </div>

        {/* 이메일 */}
        <div className="flex items-center gap-2 w-full">
          <input
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            placeholder="이메일 주소"
            className="flex-1 min-w-0 h-11 rounded-xl border border-gray-200 px-4 outline-none focus:border-gray-400"
          />

          <span className="shrink-0 text-gray-700 font-medium">@</span>

          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="flex-1 min-w-0 h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400 bg-white"
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
          <input
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="도메인 직접 입력"
            className="w-full h-11 rounded-xl border border-gray-200 outline-none focus:border-gray-400 px-4"
          />
        )}
        {/* 가입 버튼 */}
        <button
          type="submit"
          disabled={!isFormValid || !isUsernameAvailable || isSubmitting}
          className={[
            "w-full h-11 rounded-xl border outline-none mt-2",
            isFormValid && isUsernameAvailable && !isSubmitting
              ? "bg-gray-900 text-white cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed",
          ].join(" ")}
        >
          {isSubmitting ? "가입 중..." : "회원가입 완료"}
        </button>
      </form>
    </div>
  );
}
