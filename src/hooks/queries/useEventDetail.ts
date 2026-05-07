import { useQuery } from "@tanstack/react-query";
import { getEventDetail } from "../../api/events";
import { mockEventDetail, mockEventDetailToday } from "../../mock/data";
import { queryKeys } from "../keys";

export function useEventDetail(eventId: number) {
  return useQuery({
    queryKey: queryKeys.events.detail(eventId),
    queryFn: async () => {
      try {
        return await getEventDetail(eventId);
      } catch {
        return eventId === 8 ? mockEventDetailToday : mockEventDetail;
      }
    },
    enabled: eventId > 0,
  });
}
