import { useQuery } from "@tanstack/react-query";
import { getMyClubs } from "../../api/clubs";
import { queryKeys } from "../keys";

export function useMyClubs() {
  return useQuery({
    queryKey: queryKeys.clubs.my(),
    queryFn: getMyClubs,
  });
}
