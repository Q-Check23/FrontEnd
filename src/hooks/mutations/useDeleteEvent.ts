import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEvent } from "../../api/events";
import { queryKeys } from "../keys";

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: number) => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.calendar.all });
    },
  });
}
