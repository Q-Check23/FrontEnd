import { useQuery } from "@tanstack/react-query";
import { getClubDetail } from "../../api/clubs";
import { queryKeys } from "../keys";

export function useClubDetail(clubId: number) {
  return useQuery({
    queryKey: queryKeys.clubs.detail(clubId),
    queryFn: () => getClubDetail(clubId),
    enabled: clubId > 0,
  });
}
