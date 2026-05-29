import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { setAuthNext } from "../lib/authRedirect";

export default function ProtectedRoute() {
  const accessToken = useUserStore((state) => state.accessToken);
  const location = useLocation();

  if (!accessToken) {
    setAuthNext(location.pathname + location.search);
    return <Navigate to="/landing" replace />;
  }

  return <Outlet />;
}
