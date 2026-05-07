import { useQuery } from "@tanstack/react-query";
import { getMonthlyCalendar } from "../../api/calendar";
import { mockCalendarGroups } from "../../mock/data";
import { queryKeys } from "../keys";

export function useMonthlyCalendar(year: number, month: number) {
  return useQuery({
    queryKey: queryKeys.calendar.monthly({ year, month }),
    queryFn: async () => {
      try {
        return await getMonthlyCalendar({ year, month });
      } catch {
        return mockCalendarGroups;
      }
    },
  });
}
