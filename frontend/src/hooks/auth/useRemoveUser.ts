import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth/auth.api";
import type { RemoveUserDto } from "../../api/auth/auth.types";

export const useRemoveUser = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RemoveUserDto }) => 
            authApi.removeUser(id, data),

        onSuccess: (message) => {
            console.log(message);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};