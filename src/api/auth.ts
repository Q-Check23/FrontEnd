import { API_ORIGIN, apiRequest } from "./client";

export interface NicknameCheckResponse {
  available: boolean;
}

export interface AuthCodeResponse {
  isNewUser: boolean;
  token: string;
}

export interface SignupRequest {
  name: string;
  nickname: string;
  email: string;
}

export interface AuthTokenResponse {
  userId: number;
  accessToken: string;
}

export function checkNicknameAvailability(nickname: string) {
  return apiRequest<NicknameCheckResponse>("/auth/nickname/check", {
    method: "GET",
    query: { nickname },
  });
}

export function redirectToDiscordLogin() {
  window.location.assign(`${API_ORIGIN}/api/auth/login`);
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
