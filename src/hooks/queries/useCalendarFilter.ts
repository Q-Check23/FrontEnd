import { useQuery } from "@tanstack/react-query";
import { filterCalendarEvents } from "../../api/calendar";
import { mockCalendarGroups } from "../../mock/data";
import { queryKeys } from "../keys";

export function useCalendarFilter(
  params: {
    startDate?: string;
    endDate?: string;
    eventName?: string;
    clubName?: string;
  },
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.calendar.filter(params),
    queryFn: async () => {
      try {
        return await filterCalendarEvents(params);
      } catch {
        return mockCalendarGroups.flatMap((g) => g.events);
      }
    },
    enabled,
  });
}
