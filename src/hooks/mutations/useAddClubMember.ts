import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addClubMember, type AddClubMemberRequest } from "../../api/clubs";
import { queryKeys } from "../keys";

export function useAddClubMember(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AddClubMemberRequest) => addClubMember(clubId, body),
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
