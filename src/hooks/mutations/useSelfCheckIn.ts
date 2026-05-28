import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  selfCheckInAttendance,
  type SelfCheckInRequest,
} from "../../api/attendance";
import { queryKeys } from "../keys";

export function useSelfCheckIn(eventId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SelfCheckInRequest) => selfCheckInAttendance(body),
    onSuccess: () => {
      if (eventId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.events.registrations(eventId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.events.myRegistration(eventId),
        });
      }
    },
  });
}
