import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  manualCheckInAttendance,
  type ManualCheckInRequest,
} from "../../api/attendance";
import { queryKeys } from "../keys";

export function useManualCheckIn(eventId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ManualCheckInRequest) => manualCheckInAttendance(body),
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
