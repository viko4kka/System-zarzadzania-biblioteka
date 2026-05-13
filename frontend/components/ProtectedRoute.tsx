import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../src/store/authStore";

interface ProtectedRouteProps {
  // children: React.ReactNode;
  admin?: boolean;
}

export default function ProtectedRoute({ admin = false }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;

  if (user.isBanned) return <Navigate to="/login" replace />;

  if (admin && !user.isAdmin) return <Navigate to="/user/dashboard" replace />;

  return <Outlet />;
}
