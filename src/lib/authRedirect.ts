const AUTH_NEXT_STORAGE_KEY = "qcheck:auth-next";
// 보호 경로에서 튕겨 자동 재인증을 한 번 시도했음을 표시 — Discord OAuth 에러로 다시
// /login-landing 에 떨어졌을 때 무한 redirect 루프를 막기 위한 가드.
const AUTH_AUTO_ATTEMPTED_KEY = "qcheck:auth-auto-attempted";

export function setAuthNext(path: string) {
  if (!path || path.startsWith("/landing") || path.startsWith("/login")) {
    return;
  }
  sessionStorage.setItem(AUTH_NEXT_STORAGE_KEY, path);
}

export function peekAuthNext(): string | null {
  return sessionStorage.getItem(AUTH_NEXT_STORAGE_KEY);
}

export function consumeAuthNext(): string | null {
  const next = sessionStorage.getItem(AUTH_NEXT_STORAGE_KEY);
  if (next) {
    sessionStorage.removeItem(AUTH_NEXT_STORAGE_KEY);
  }
  return next;
}

/** 한 세션에서 자동 OAuth 재시도를 했는지 여부. true 면 더는 자동 시도하지 않는다. */
export function hasAttemptedAutoRelogin(): boolean {
  return sessionStorage.getItem(AUTH_AUTO_ATTEMPTED_KEY) === "1";
}

export function markAutoReloginAttempted() {
  sessionStorage.setItem(AUTH_AUTO_ATTEMPTED_KEY, "1");
}

export function clearAutoReloginAttempt() {
  sessionStorage.removeItem(AUTH_AUTO_ATTEMPTED_KEY);
}
