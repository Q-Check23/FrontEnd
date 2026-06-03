import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { useToastStore } from "../../stores/useToastStore";
import {
  clearAutoReloginAttempt,
  consumeAuthNext,
} from "../../lib/authRedirect";

const SIGNUP_TOKEN_STORAGE_KEY = "qcheck:signup-token";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAccessToken = useUserStore((state) => state.setAccessToken);
  const pushToast = useToastStore((state) => state.push);

  useEffect(() => {
    const token = searchParams.get("token");
    const isNewUser = searchParams.get("isNewUser") === "true";
    const errorMessage = searchParams.get("error");

    if (errorMessage) {
      pushToast(errorMessage);
      navigate("/login-landing", { replace: true });
      return;
    }

    if (!token) {
      pushToast("로그인 응답이 올바르지 않습니다.");
      navigate("/login-landing", { replace: true });
      return;
    }

    if (isNewUser) {
      sessionStorage.setItem(SIGNUP_TOKEN_STORAGE_KEY, token);
      navigate("/login", { replace: true });
      return;
    }

    setAccessToken(token);
    // 자동 재인증이 성공으로 끝났으니 가드 플래그 해제 — 다음 보호경로 튕김 시
    // 또 한 번 자동 시도가 가능하도록 정상 상태로 복귀시킨다.
    clearAutoReloginAttempt();
    const next = consumeAuthNext();
    navigate(next ?? "/home", { replace: true });
  }, [navigate, pushToast, searchParams, setAccessToken]);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <p className="text-sm text-on-surface-variant">로그인 처리 중...</p>
    </div>
  );
}

export { SIGNUP_TOKEN_STORAGE_KEY };
