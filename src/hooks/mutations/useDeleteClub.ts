import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClub } from "../../api/clubs";
import { queryKeys } from "../keys";

export function useDeleteClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clubId: number) => deleteClub(clubId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.my() });
    },
  });
}
