import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveClub } from "../../api/clubs";
import { queryKeys } from "../keys";

export function useLeaveClub(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => leaveClub(clubId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.my() });
      queryClient.removeQueries({
        queryKey: queryKeys.clubs.members(clubId),
      });
    },
  });
}
