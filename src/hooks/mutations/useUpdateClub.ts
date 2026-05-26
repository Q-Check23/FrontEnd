import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClub, type UpdateClubRequest } from "../../api/clubs";
import { queryKeys } from "../keys";

export function useUpdateClub(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateClubRequest) => updateClub(clubId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.clubs.detail(clubId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.my() });
    },
  });
}
