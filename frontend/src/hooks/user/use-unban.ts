import { useMutation } from "@tanstack/react-query";
import { userApi } from "../../api/user/user.api";

export const useUnban = () => {
    return useMutation({
        mutationFn: (id: string) => userApi.unban(id),

        onSuccess: (message) => {
                console.log(message);
            },
        onError: (error) => {
            console.error(error);
        },
    });
};