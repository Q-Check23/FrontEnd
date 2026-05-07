import { API_ORIGIN, apiRequest } from "./client";

export interface NicknameCheckResponse {
  available: boolean;
}

export interface AuthCodeResponse {
  isNewUser: boolean;
  token: string;
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
