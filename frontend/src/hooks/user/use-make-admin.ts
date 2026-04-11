import { useMutation } from "@tanstack/react-query";
import { userApi } from "../../api/user/user.api";

export const useMakeAdmin = () => {
    return useMutation({
        mutationFn: (id: string) => userApi.makeAdmin(id),

        onSuccess: (message) => {
            console.log(message);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};