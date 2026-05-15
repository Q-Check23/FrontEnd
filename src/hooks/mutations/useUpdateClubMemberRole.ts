import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateClubMemberRole,
  type UpdateClubMemberRoleRequest,
} from "../../api/clubs";
import { queryKeys } from "../keys";

interface Variables {
  memberId: number;
  body: UpdateClubMemberRoleRequest;
}

export function useUpdateClubMemberRole(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, body }: Variables) =>
      updateClubMemberRole(clubId, memberId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clubs.members(clubId),
      });
    },
  });
}
