import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeClubMember } from "../../api/clubs";
import { queryKeys } from "../keys";

export function useRemoveClubMember(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: number) => removeClubMember(clubId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clubs.members(clubId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.clubs.detail(clubId),
      });
    },
  });
}
