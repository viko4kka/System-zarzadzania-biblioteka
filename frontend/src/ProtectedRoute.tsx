import { Navigate, Outlet } from "react-router-dom";
import { useLoggedInUserData } from "./hooks/user/useLoggedInUserData";
import { PulseLoader } from "react-spinners";

interface ProtectedRouteProps {
  admin?: boolean;
}

export default function ProtectedRoute({ admin = false }: ProtectedRouteProps) {
  const { user, isLoading } = useLoggedInUserData();

  if (isLoading) return <PulseLoader size={12} color="white" />;

  if (!user) return <Navigate to="/403" replace />;
  if (user.isBanned) return <Navigate to="/403" replace />;
  if (admin && !user.isAdmin) return <Navigate to="/403" replace />;
  if (!admin && user.isAdmin) return <Navigate to="/403" replace />;

  return <Outlet />;
}
