import { apiRequest } from "./client";

interface MyProfileResponse {
  id: number;
  username: string | null;
  realName: string | null;
  email: string | null;
  phone: string | null;
}

export interface MyProfile {
  id: number;
  username: string;
  realName: string;
  email: string;
  phone: string;
}

export interface UpdateMyProfileRequest {
  realName: string;
  username: string;
  phone: string;
}

function normalizeText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function mapProfile(response: MyProfileResponse): MyProfile {
  return {
    id: response.id,
    username: normalizeText(response.username) || `user-${response.id}`,
    realName: normalizeText(response.realName),
    email: normalizeText(response.email),
    phone: normalizeText(response.phone),
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

export interface MyUserStats {
  attended: number;
  upcoming: number;
}

interface MyUserStatsResponse {
  attendedEventCount: number;
  upcomingEventCount: number;
}

export async function getMyStats(): Promise<MyUserStats> {
  const response = await apiRequest<MyUserStatsResponse>("/users/me/stats", {
    method: "GET",
    auth: { type: "dev-user" },
  });

  return {
    attended: response.attendedEventCount,
    upcoming: response.upcomingEventCount,
  };
}

export interface UserSearchResult {
  userId: number;
  username: string;
  realName: string | null;
}

export interface SearchUsersParams {
  username?: string;
  email?: string;
}

export function searchUsers(params: SearchUsersParams) {
  return apiRequest<UserSearchResult[]>("/users/search", {
    method: "GET",
    auth: { type: "dev-user" },
    query: {
      username: params.username,
      email: params.email,
    },
  });
}

