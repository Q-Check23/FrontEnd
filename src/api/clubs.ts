import { apiRequest } from "./client";

export type ClubRole = "OWNER" | "ADMIN" | "MEMBER";

interface ClubSummaryResponse {
  clubId: number;
  clubName: string | null;
  clubDescription: string | null;
  myRole: string | null;
}

export interface ClubSummary {
  clubId: number;
  clubName: string;
  clubDescription: string;
  myRole: string;
}

export interface CreateClubRequest {
  name: string;
  description: string;
  discordGuildId: string;
  coverImageUrl: string;
}

export interface UpdateClubRequest {
  name?: string;
  description?: string;
  coverImageUrl?: string;
  discordGuildId?: string;
}

export interface ClubDetailResponse {
  clubId: number;
  clubName: string;
  clubDescription: string;
  memberCount: number;
  myRole: string;
  discordGuildId: string | null;
}

export interface ClubResponse {
  id: number;
  name: string;
  description: string;
}

export interface ClubMember {
  memberId: number;
  userId: number;
  username: string;
  role: ClubRole;
}

export interface UpdateClubMemberRoleRequest {
  role: ClubRole;
}

function normalizeText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function mapClubSummary(club: ClubSummaryResponse): ClubSummary {
  return {
    clubId: club.clubId,
    clubName: normalizeText(club.clubName) || `클럽 ${club.clubId}`,
    clubDescription: normalizeText(club.clubDescription),
    myRole: normalizeText(club.myRole) || "MEMBER",
  };
}

export async function getMyClubs() {
  const response = await apiRequest<ClubSummaryResponse[]>("/clubs", {
    method: "GET",
    auth: { type: "dev-user" },
  });

  return response.map(mapClubSummary);
}

export function createClub(body: CreateClubRequest) {
  return apiRequest<ClubResponse>("/clubs", {
    method: "POST",
    auth: { type: "dev-user" },
    body,
  });
}

export function getClubDetail(clubId: number) {
  return apiRequest<ClubDetailResponse>(`/clubs/${clubId}`, {
    method: "GET",
    auth: { type: "dev-user" },
  });
}

export function updateClub(clubId: number, body: UpdateClubRequest) {
  return apiRequest<ClubDetailResponse>(`/clubs/${clubId}`, {
    method: "PUT",
    auth: { type: "dev-user" },
    body,
  });
}

export function deleteClub(clubId: number) {
  return apiRequest<void>(`/clubs/${clubId}`, {
    method: "DELETE",
    auth: { type: "dev-user" },
  });
}

export function getClubMembers(clubId: number) {
  return apiRequest<ClubMember[]>(`/clubs/${clubId}/members`, {
    method: "GET",
    auth: { type: "dev-user" },
  });
}

export function joinClubViaEvent(eventId: number) {
  return apiRequest<void>(`/clubs/join-via-event/${eventId}`, {
    method: "POST",
    auth: { type: "dev-user" },
  });
}

export function updateClubMemberRole(
  clubId: number,
  memberId: number,
  body: UpdateClubMemberRoleRequest,
) {
  return apiRequest<void>(`/clubs/${clubId}/members/${memberId}/role`, {
    method: "PUT",
    auth: { type: "dev-user" },
    body,
  });
}

export function leaveClub(clubId: number) {
  return apiRequest<void>(`/clubs/${clubId}/members/me`, {
    method: "DELETE",
    auth: { type: "dev-user" },
  });
}

export function removeClubMember(clubId: number, memberId: number) {
  return apiRequest<void>(`/clubs/${clubId}/members/${memberId}`, {
    method: "DELETE",
    auth: { type: "dev-user" },
  });
}
