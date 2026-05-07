import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateMyProfile,
  type UpdateMyProfileRequest,
} from "../../api/users";
import { useUserStore } from "../../stores/useUserStore";
import { queryKeys } from "../keys";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateMyProfileRequest) => updateMyProfile(body),
    onSuccess: (data) => {
      useUserStore.getState().setProfile(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
    },
  });
}
