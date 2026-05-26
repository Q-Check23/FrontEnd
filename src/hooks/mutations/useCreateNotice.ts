import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNotice, type CreateNoticeRequest } from "../../api/notices";
import { queryKeys } from "../keys";

export function useCreateNotice(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateNoticeRequest) => createNotice(clubId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.list(clubId) });
    },
  });
}
