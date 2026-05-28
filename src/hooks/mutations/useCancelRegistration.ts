import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelMyRegistration } from "../../api/events";
import { queryKeys } from "../keys";

export function useCancelRegistration(eventId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelMyRegistration(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.registrations(eventId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.myRegistration(eventId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.detail(eventId),
      });
    },
  });
}
