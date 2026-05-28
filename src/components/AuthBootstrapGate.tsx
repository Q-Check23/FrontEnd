import { useLocation } from "react-router-dom";
import { useAuthBootstrap } from "../hooks/useAuthBootstrap";
import { useUserStore } from "../stores/useUserStore";
import LoadingSpinner from "./LoadingSpinner";

const BYPASS_PATHS = new Set([
  "/auth/callback",
  "/landing",
  "/login",
  "/login-landing",
]);

export default function AuthBootstrapGate({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthBootstrap();
  const status = useUserStore((s) => s.bootstrapStatus);
  const hasAccessToken = useUserStore((s) => s.accessToken !== null);
  const location = useLocation();

  if (
    status === "pending" &&
    !hasAccessToken &&
    !BYPASS_PATHS.has(location.pathname)
  ) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
