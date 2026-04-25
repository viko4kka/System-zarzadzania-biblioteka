import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth/auth.api";
import type { RegisterDto } from "../../api/auth/auth.types";

export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterDto) => authApi.register(data),

        onSuccess: ({ registeredUser, message }) => {
            console.log(message);
            console.log("Nowy użytkownik:", registeredUser);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};