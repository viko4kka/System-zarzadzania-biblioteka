import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../src/store/authStore";

interface ProtectedRouteProps {
  admin?: boolean;
}

export default function ProtectedRoute({ admin = false }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/403" replace />;

  if (user.isBanned) return <Navigate to="/403" replace />;

  if (admin && !user.isAdmin) return <Navigate to="/403" replace />;

  return <Outlet />;
}
