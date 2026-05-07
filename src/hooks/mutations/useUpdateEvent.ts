import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEvent, type UpdateEventRequest } from "../../api/events";
import { queryKeys } from "../keys";

export function useUpdateEvent(eventId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateEventRequest) => updateEvent(eventId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.detail(eventId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}
