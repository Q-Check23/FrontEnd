import { useQuery } from "@tanstack/react-query";
import { getEvents, type ListEventsParams } from "../../api/events";
import { mockEventList } from "../../mock/data";
import { queryKeys } from "../keys";

export function useEvents(params?: ListEventsParams) {
  return useQuery({
    queryKey: queryKeys.events.list(params),
    queryFn: async () => {
      try {
        return await getEvents(params);
      } catch {
        return mockEventList;
      }
    },
  });
}
