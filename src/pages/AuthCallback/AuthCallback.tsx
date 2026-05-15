import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { useToastStore } from "../../stores/useToastStore";

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
    navigate("/home", { replace: true });
  }, [navigate, pushToast, searchParams, setAccessToken]);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <p className="text-sm text-on-surface-variant">로그인 처리 중...</p>
    </div>
  );
}

export { SIGNUP_TOKEN_STORAGE_KEY };
