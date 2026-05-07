import { useQuery } from "@tanstack/react-query";
import { searchCalendarEvents } from "../../api/calendar";
import { mockCalendarGroups } from "../../mock/data";
import { queryKeys } from "../keys";

export function useCalendarSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.calendar.search(query),
    queryFn: async () => {
      try {
        return await searchCalendarEvents(query);
      } catch {
        const allEvents = mockCalendarGroups.flatMap((g) => g.events);
        const q = query.trim().toLowerCase();
        return allEvents.filter(
          (e) =>
            e.eventTitle.toLowerCase().includes(q) ||
            e.clubName.toLowerCase().includes(q),
        );
      }
    },
    enabled: enabled && query.trim().length > 0,
  });
}
