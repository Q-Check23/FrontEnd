import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEventRegistration,
  type CreateEventRegistrationRequest,
} from "../../api/events";
import { queryKeys } from "../keys";

export function useCreateRegistration(eventId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateEventRegistrationRequest) =>
      createEventRegistration(eventId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.registrations(eventId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.myRegistration(eventId),
      });
    },
  });
}
