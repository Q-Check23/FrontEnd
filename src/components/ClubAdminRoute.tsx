import { Navigate, Outlet } from "react-router-dom";
import { useClubIdFromRoute, useClubRole } from "../hooks";
import LoadingSpinner from "./LoadingSpinner";

export default function ClubAdminRoute() {
  const { clubId, isResolving } = useClubIdFromRoute();
  const { isAdmin, isLoading } = useClubRole(clubId);

  if (isResolving || (clubId !== undefined && isLoading)) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (clubId === undefined) {
    return <Navigate to="/meeting" replace />;
  }

  if (!isAdmin) {
    return <Navigate to={`/group-events?clubId=${clubId}`} replace />;
  }

  return <Outlet />;
}
