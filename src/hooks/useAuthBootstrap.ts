import { useEffect, useRef } from "react";
import { refreshAccessToken } from "../api/auth";
import { getMyProfile } from "../api/users";
import { queryClient } from "../lib/query-client";
import { useUserStore } from "../stores/useUserStore";
import { queryKeys } from "./keys";

export function useAuthBootstrap() {
  const ranRef = useRef(false);
  const setProfile = useUserStore((s) => s.setProfile);
  const setAccessToken = useUserStore((s) => s.setAccessToken);
  const setBootstrapStatus = useUserStore((s) => s.setBootstrapStatus);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    let cancelled = false;

    (async () => {
      try {
        const data = await refreshAccessToken();
        if (cancelled) return;
        setAccessToken(data.accessToken);

        try {
          const profile = await queryClient.fetchQuery({
            queryKey: queryKeys.users.me(),
            queryFn: getMyProfile,
          });
          if (!cancelled) setProfile(profile);
        } catch {
          // 프로필 로드 실패는 무시 — 각 페이지에서 lazy 로드됨
        }

        if (!cancelled) setBootstrapStatus("authed");
      } catch {
        if (cancelled) return;
        setBootstrapStatus("guest");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setAccessToken, setBootstrapStatus, setProfile]);
}
