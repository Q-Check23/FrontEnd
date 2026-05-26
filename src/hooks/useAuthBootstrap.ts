import { useEffect } from "react";
import { refreshAccessToken } from "../api/auth";
import { getMyProfile } from "../api/users";
import { queryClient } from "../lib/query-client";
import { useUserStore } from "../stores/useUserStore";
import { queryKeys } from "./keys";

let bootstrapInflight = false;

export function useAuthBootstrap() {
  const setProfile = useUserStore((s) => s.setProfile);
  const setAccessToken = useUserStore((s) => s.setAccessToken);
  const setBootstrapStatus = useUserStore((s) => s.setBootstrapStatus);

  useEffect(() => {
    if (bootstrapInflight) return;
    if (useUserStore.getState().bootstrapStatus !== "pending") return;
    bootstrapInflight = true;

    (async () => {
      try {
        const data = await refreshAccessToken();
        setAccessToken(data.accessToken);

        try {
          const profile = await queryClient.fetchQuery({
            queryKey: queryKeys.users.me(),
            queryFn: getMyProfile,
          });
          setProfile(profile);
        } catch {
          // 프로필 로드 실패는 무시 — 각 페이지에서 lazy 로드됨
        }

        setBootstrapStatus("authed");
      } catch {
        setBootstrapStatus("guest");
      } finally {
        bootstrapInflight = false;
      }
    })();
  }, [setAccessToken, setBootstrapStatus, setProfile]);
}
