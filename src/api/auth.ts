import { apiRequest } from "./client";

export interface NicknameCheckResponse {
  available: boolean;
}

export function checkNicknameAvailability(nickname: string) {
  return apiRequest<NicknameCheckResponse>("/auth/nickname/check", {
    method: "GET",
    query: { nickname },
  });
}
