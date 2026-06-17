import { useMutation } from "@tanstack/react-query";
import { userApi } from "../../api/user/user.api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useMakeAdmin = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userApi.makeAdmin(id),

        onSuccess: (message) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success('User privileges have been elevated')
            console.log(message);
        },
        onError: (error) => {
            toast.error('Could not  elevate user privileges')
            console.error(error);
        },
    });
};