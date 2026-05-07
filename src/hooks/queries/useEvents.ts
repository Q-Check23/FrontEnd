import { useQuery } from "@tanstack/react-query";
import { getEvents, type ListEventsParams } from "../../api/events";
import { queryKeys } from "../keys";

export function useEvents(params?: ListEventsParams) {
  return useQuery({
    queryKey: queryKeys.events.list(params),
    queryFn: () => getEvents(params),
  });
}
