import { useQuery } from "@tanstack/react-query";
import { getMyEventRegistration } from "../../api/events";
import { queryKeys } from "../keys";

export function useMyEventRegistration(eventId: number) {
  return useQuery({
    queryKey: [...queryKeys.events.all, eventId, "my-registration"] as const,
    queryFn: () => getMyEventRegistration(eventId),
    enabled: eventId > 0,
  });
}
