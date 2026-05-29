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
    // 전역 onError(백엔드 영문 메시지 토스트)를 끄고, 에러 노출은
    // 화면(Checkin)의 mutate 콜백에서 한글 문구로 직접 처리한다.
    onError: () => {},
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
