import { useMutation } from "@tanstack/react-query";
import { userApi } from "../../api/user/user.api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export const useBan = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userApi.ban(id),

        onSuccess: (message) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success('User has been baned')
            console.log( message);
        },
        onError: (error) => {
             toast.error('Could not ban user')
            console.error( error);
        },
    });
};