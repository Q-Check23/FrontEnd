import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClub, type CreateClubRequest } from "../../api/clubs";
import { queryKeys } from "../keys";

export function useCreateClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateClubRequest) => createClub(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs.my() });
    },
  });
}
