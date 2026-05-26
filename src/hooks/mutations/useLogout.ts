import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../api/auth";
import { useUserStore } from "../../stores/useUserStore";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    // 서버 로그아웃 성공/실패와 무관하게 클라이언트 세션은 항상 정리한다
    // (토큰 만료·네트워크 오류로 서버 호출이 실패해도 로그아웃은 되어야 함)
    onSettled: () => {
      useUserStore.getState().clear();
      queryClient.clear();
    },
  });
}
