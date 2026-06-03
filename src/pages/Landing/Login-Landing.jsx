import { useEffect, useState } from "react";
import logo from "../../assets/png/logo2.png";
import discord_logo from "../../assets/png/discord.png";
import { redirectToDiscordLogin } from "../../api/auth";
import {
  peekAuthNext,
  hasAttemptedAutoRelogin,
  markAutoReloginAttempted,
} from "../../lib/authRedirect";

export default function Login_Landing() {
  // 보호 경로에서 인증 실패로 튕겨 들어온 경우 (authNext 가 세션에 저장돼 있음),
  // 디스코드 OAuth 를 한 번 자동 트리거해서 디스코드 세션이 살아있다면 사용자가
  // 버튼을 누르지 않아도 원래 가려던 곳으로 복귀하도록 한다.
  // 한 세션에서 한 번만 시도 — OAuth 가 에러로 실패해 다시 떨어졌을 때
  // 무한 redirect 루프를 막는다.
  const [redirecting] = useState(() => {
    if (peekAuthNext() && !hasAttemptedAutoRelogin()) {
      markAutoReloginAttempted();
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (redirecting) {
      // 자동 재인증 — prompt=none 으로 보내 디스코드 동의 화면을 건너뛴다.
      // 인가 안 된 사용자의 경우 백엔드가 자동으로 일반 흐름으로 폴백.
      redirectToDiscordLogin(true);
    }
  }, [redirecting]);

  if (redirecting) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-sm text-on-surface-variant">로그인 중...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
      <img src={logo} alt="Q-Check 로고" className="w-38 h-auto" />
      <button
        type="button"
        onClick={redirectToDiscordLogin}
        className="w-50 h-20 overflow-hidden flex items-center justify-center active:scale-95 transition-transform"
      >
        <img
          src={discord_logo}
          alt="디스코드 로그인"
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
}
