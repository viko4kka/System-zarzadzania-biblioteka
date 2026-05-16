import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../api/auth/auth.api";
import { useAuthStore } from "../../store/authStore";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = async () => {
    await authApi.logout();

    useAuthStore.setState({
      user: null,
    });

    queryClient.clear();
    navigate("/login");
  };

  return { logout };
};
