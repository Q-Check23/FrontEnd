import { useQuery } from "@tanstack/react-query";
import { getEventDetail } from "../../api/events";
import { mockEventDetail } from "../../mock/data";
import { queryKeys } from "../keys";

export function useEventDetail(eventId: number) {
  return useQuery({
    queryKey: queryKeys.events.detail(eventId),
    queryFn: async () => {
      try {
        return await getEventDetail(eventId);
      } catch {
        return mockEventDetail;
      }
    },
    enabled: eventId > 0,
  });
}
