import { useMutation } from "@tanstack/react-query";
import { userApi } from "../../api/user/user.api";

export const useBan = () => {
    return useMutation({
        mutationFn: (id: string) => userApi.ban(id),

        onSuccess: (message) => {
            console.log(message);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};