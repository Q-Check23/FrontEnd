import { useQuery } from "@tanstack/react-query";
import { getEventRegistrations } from "../../api/events";
import { mockRegistrations } from "../../mock/data";
import { queryKeys } from "../keys";

export function useEventRegistrations(eventId: number) {
  return useQuery({
    queryKey: queryKeys.events.registrations(eventId),
    queryFn: async () => {
      try {
        return await getEventRegistrations(eventId);
      } catch {
        return mockRegistrations;
      }
    },
    enabled: eventId > 0,
  });
}
