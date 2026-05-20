import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authApi } from "../../api/auth/auth.api";
import type { LoginDto } from "../../api/auth/auth.types";

export const useLogin = () => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(`User logged in successfully!`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { isPending, mutate };
};
