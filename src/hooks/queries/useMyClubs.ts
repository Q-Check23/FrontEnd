import { useQuery } from "@tanstack/react-query";
import { getMyClubs } from "../../api/clubs";
import { mockClubs } from "../../mock/data";
import { queryKeys } from "../keys";

export function useMyClubs() {
  return useQuery({
    queryKey: queryKeys.clubs.my(),
    queryFn: async () => {
      try {
        return await getMyClubs();
      } catch {
        return mockClubs;
      }
    },
  });
}
