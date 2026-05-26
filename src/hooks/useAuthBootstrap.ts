import { useEffect, useRef } from "react";
import { refreshAccessToken } from "../api/auth";
import { useUserStore } from "../stores/useUserStore";

export function useAuthBootstrap() {
  const ranRef = useRef(false);
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
        setBootstrapStatus("authed");
      } catch {
        if (cancelled) return;
        setBootstrapStatus("guest");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setAccessToken, setBootstrapStatus]);
}
