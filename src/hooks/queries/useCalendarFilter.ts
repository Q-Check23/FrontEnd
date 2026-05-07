import { useQuery } from "@tanstack/react-query";
import { filterCalendarEvents } from "../../api/calendar";
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
    queryFn: () => filterCalendarEvents(params),
    enabled,
  });
}
