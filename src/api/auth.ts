import { API_ORIGIN, apiRequest } from "./client";

export interface UsernameCheckResponse {
  available: boolean;
}

export interface AuthCodeResponse {
  isNewUser: boolean;
  token: string;
}

export interface SignupRequest {
  name: string;
  username: string;
  email: string;
  phone: string;
}

export interface AuthTokenResponse {
  userId: number;
  accessToken: string;
}

export function checkUsernameAvailability(username: string) {
  return apiRequest<UsernameCheckResponse>("/auth/username/check", {
    method: "GET",
    query: { username },
  });
}

/**
 * Discord OAuth 로그인 페이지로 redirect 한다.
 * silent=true 면 백엔드가 prompt=none 으로 Discord 에 요청 → 이미 인가된
 * 사용자는 동의 화면 없이 곧바로 콜백으로 돌아온다. 인가 안 된 사용자의
 * 경우 백엔드가 자동으로 일반 흐름(동의 화면) 으로 폴백한다.
 */
export function redirectToDiscordLogin(silent: boolean = false) {
  const url = silent
    ? `${API_ORIGIN}/api/auth/login?silent=true`
    : `${API_ORIGIN}/api/auth/login`;
  window.location.assign(url);
}

export function signup(payload: SignupRequest, signupToken: string) {
  return apiRequest<AuthTokenResponse>("/auth/signup", {
    method: "POST",
    body: payload,
    auth: { type: "bearer", token: signupToken },
  });
}

export function refreshAccessToken() {
  return apiRequest<AuthTokenResponse>("/auth/refresh", {
    method: "POST",
  });
}

export function logout() {
  return apiRequest<void>("/auth/logout", {
    method: "POST",
    auth: { type: "dev-user" },
  });
}
