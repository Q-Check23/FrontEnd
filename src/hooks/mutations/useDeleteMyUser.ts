import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMyUser } from "../../api/users";
import { useAuthStore } from "../../stores/useAuthStore";

export function useDeleteMyUser() {
  const queryClient = useQueryClient();
  const clearToken = useAuthStore((s) => s.clear);

  return useMutation({
    mutationFn: () => deleteMyUser(),
    onSuccess: () => {
      clearToken();
      queryClient.clear();
    },
  });
}
