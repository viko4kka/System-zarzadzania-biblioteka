import { useNavigate } from "react-router";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/login");
  };

  return { logout };
};