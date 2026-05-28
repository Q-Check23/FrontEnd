import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotice } from "../../api/notices";
import { queryKeys } from "../keys";

export function useDeleteNotice(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noticeId: number) => deleteNotice(clubId, noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notices.list(clubId),
      });
    },
  });
}
