import { useQuery } from "@tanstack/react-query";
import { getMyEventRegistration } from "../../api/events";
import { queryKeys } from "../keys";

export function useMyEventRegistration(eventId: number) {
  return useQuery({
    queryKey: queryKeys.events.myRegistration(eventId),
    queryFn: () => getMyEventRegistration(eventId),
    enabled: eventId > 0,
    // 체크인 상태는 행동에 직결되는 값이라 항상 신선해야 한다.
    // stale 캐시(REGISTERED)로 자동 체크인을 오판하지 않도록 0으로 둔다.
    staleTime: 0,
  });
}
