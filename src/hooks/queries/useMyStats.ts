import { useQuery } from "@tanstack/react-query";
import { getMyStats } from "../../api/users";
import { queryKeys } from "../keys";

export function useMyStats() {
  return useQuery({
    queryKey: queryKeys.users.stats(),
    queryFn: getMyStats,
  });
}
