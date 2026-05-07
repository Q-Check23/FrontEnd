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

export interface AddClubMemberRequest {
  userId: number;
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

export function getClubMembers(clubId: number) {
  return apiRequest<ClubMember[]>(`/clubs/${clubId}/members`, {
    method: "GET",
    auth: { type: "dev-user" },
  });
}

export function addClubMember(clubId: number, body: AddClubMemberRequest) {
  return apiRequest<void>(`/clubs/${clubId}/members`, {
    method: "POST",
    auth: { type: "dev-user" },
    body,
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
