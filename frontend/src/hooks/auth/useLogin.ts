import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth/auth.api";
import type { LoginDto } from "../../api/auth/auth.types";
import toast from "react-hot-toast";

export const useLogin = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),

    onSuccess: () => {
      toast.success(`User logged in successfully!`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { isPending, mutate };
};
