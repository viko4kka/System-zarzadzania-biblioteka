import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth/auth.api";
import type { LoginDto } from "../../api/auth/auth.types";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

export const useLogin = () => {
  const { setUser } = useAuthStore();

  const { isPending, mutate } = useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),

    onSuccess: (data) => {
      setUser(data.user);
      toast.success(`User logged in successfully!`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { isPending, mutate };
};
