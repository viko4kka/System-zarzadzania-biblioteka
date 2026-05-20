import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authApi } from "../../api/auth/auth.api";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = async () => {
    await authApi.logout();

    queryClient.clear();
    navigate("/login");
  };

  return { logout };
};
