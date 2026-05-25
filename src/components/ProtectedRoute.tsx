import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

export default function ProtectedRoute() {
  const accessToken = useUserStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/landing" replace />;
  }

  return <Outlet />;
}
