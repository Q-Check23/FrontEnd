import { useQuery } from "@tanstack/react-query";
import { getClubMembers } from "../../api/clubs";
import { queryKeys } from "../keys";

export function useClubMembers(clubId: number) {
  return useQuery({
    queryKey: queryKeys.clubs.members(clubId),
    queryFn: () => getClubMembers(clubId),
    enabled: clubId > 0,
  });
}
