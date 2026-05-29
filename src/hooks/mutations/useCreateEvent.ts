import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent, type CreateEventRequest } from "../../api/events";
import { queryKeys } from "../keys";

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateEventRequest) => createEvent(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.calendar.all });
    },
  });
}
