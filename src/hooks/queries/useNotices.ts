import { useQuery } from "@tanstack/react-query";
import { getNotices } from "../../api/notices";
import { queryKeys } from "../keys";

export function useNotices(clubId: number) {
  return useQuery({
    queryKey: queryKeys.notices.list(clubId),
    queryFn: () => getNotices(clubId),
    enabled: clubId > 0,
  });
}
