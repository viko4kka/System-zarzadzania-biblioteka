import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = () => {
    queryClient.clear();
    navigate("/login");
  };

  return { logout };
};