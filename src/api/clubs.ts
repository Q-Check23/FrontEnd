import { apiRequest } from "./client";

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
