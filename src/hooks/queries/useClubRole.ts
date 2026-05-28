import type { ClubRole } from "../../api/clubs";
import { useClubDetail } from "./useClubDetail";

const VALID_ROLES: ReadonlySet<ClubRole> = new Set([
  "OWNER",
  "ADMIN",
  "MEMBER",
]);

function normalizeRole(value: string | undefined): ClubRole | undefined {
  if (!value) return undefined;
  return VALID_ROLES.has(value as ClubRole) ? (value as ClubRole) : undefined;
}

export function useClubRole(clubId: number | undefined) {
  const query = useClubDetail(clubId ?? 0);
  const role = normalizeRole(query.data?.myRole);

  return {
    role,
    isAdmin: role === "OWNER" || role === "ADMIN",
    isOwner: role === "OWNER",
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
