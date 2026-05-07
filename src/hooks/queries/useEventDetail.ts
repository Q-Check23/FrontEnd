import { useQuery } from "@tanstack/react-query";
import { getEventDetail } from "../../api/events";
import { queryKeys } from "../keys";

export function useEventDetail(eventId: number) {
  return useQuery({
    queryKey: queryKeys.events.detail(eventId),
    queryFn: () => getEventDetail(eventId),
    enabled: eventId > 0,
  });
}
