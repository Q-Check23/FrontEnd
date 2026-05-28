import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNotice, type UpdateNoticeRequest } from "../../api/notices";
import { queryKeys } from "../keys";

export function useUpdateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateNoticeRequest) => updateNotice(body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notices.list(variables.clubId),
      });
    },
  });
}
