import { apiRequest } from "./client";

interface MyProfileResponse {
  id: number;
  username: string | null;
  realName: string | null;
}

export interface MyProfile {
  id: number;
  username: string;
  realName: string;
}

export interface UpdateMyProfileRequest {
  realName: string;
}

function normalizeText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function mapProfile(response: MyProfileResponse): MyProfile {
  return {
    id: response.id,
    username: normalizeText(response.username) || `user-${response.id}`,
    realName: normalizeText(response.realName),
  };
}

export async function getMyProfile() {
  const response = await apiRequest<MyProfileResponse>("/users/me", {
    method: "GET",
    auth: { type: "dev-user" },
  });

  return mapProfile(response);
}

export async function updateMyProfile(body: UpdateMyProfileRequest) {
  const response = await apiRequest<MyProfileResponse>("/users/me", {
    method: "PUT",
    auth: { type: "dev-user" },
    body,
  });

  return mapProfile(response);
}

export interface UserSearchResult {
  userId: number;
  username: string;
  realName: string | null;
}

export interface SearchUsersParams {
  nickname?: string;
  email?: string;
}

export function searchUsers(params: SearchUsersParams) {
  return apiRequest<UserSearchResult[]>("/users/search", {
    method: "GET",
    auth: { type: "dev-user" },
    query: {
      nickname: params.nickname,
      email: params.email,
    },
  });
}
