import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth/auth.api";
import type { LoginDto } from "../../api/auth/auth.types";

export const useLogin = () => {
    return useMutation({
        mutationFn: (data: LoginDto) => authApi.login(data),

        onSuccess: ({ message }) => {
            console.log(message);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};