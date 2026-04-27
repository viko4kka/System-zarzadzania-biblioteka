import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth/auth.api";
import type { RegisterDto } from "../../api/auth/auth.types";
import toast from "react-hot-toast";

export const useRegister = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: ({ registeredUser, message }) => {
      console.log(message);
      toast.success("Account created! Please log in.");
      console.log("Nowy użytkownik:", registeredUser);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    },
  });

  return { isPending, mutate };
};
