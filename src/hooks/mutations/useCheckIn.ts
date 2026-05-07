import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  checkInAttendance,
  type AttendanceCheckInRequest,
} from "../../api/attendance";
import { queryKeys } from "../keys";

export function useCheckIn(eventId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AttendanceCheckInRequest) => checkInAttendance(body),
    onSuccess: () => {
      if (eventId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.events.registrations(eventId),
        });
      }
    },
  });
}
