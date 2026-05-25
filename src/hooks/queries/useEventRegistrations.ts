import { useQuery } from "@tanstack/react-query";
import { getEventRegistrations } from "../../api/events";
import { queryKeys } from "../keys";

export function useEventRegistrations(eventId: number) {
  return useQuery({
    queryKey: queryKeys.events.registrations(eventId),
    queryFn: () => getEventRegistrations(eventId),
    enabled: eventId > 0,
  });
}
