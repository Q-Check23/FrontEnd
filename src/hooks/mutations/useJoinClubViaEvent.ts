import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinClubViaEvent } from "../../api/clubs";
import { queryKeys } from "../keys";

export function useJoinClubViaEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: number) => joinClubViaEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.my() });
      queryClient.invalidateQueries({ queryKey: ["clubs", "detail"] });
    },
  });
}
