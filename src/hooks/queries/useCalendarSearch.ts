import { useQuery } from "@tanstack/react-query";
import { searchCalendarEvents } from "../../api/calendar";
import { queryKeys } from "../keys";

export function useCalendarSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.calendar.search(query),
    queryFn: () => searchCalendarEvents(query),
    enabled: enabled && query.trim().length > 0,
  });
}
