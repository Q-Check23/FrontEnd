import { useQuery } from "@tanstack/react-query";
import { getMonthlyCalendar } from "../../api/calendar";
import { queryKeys } from "../keys";

export function useMonthlyCalendar(year: number, month: number) {
  return useQuery({
    queryKey: queryKeys.calendar.monthly({ year, month }),
    queryFn: () => getMonthlyCalendar({ year, month }),
  });
}
