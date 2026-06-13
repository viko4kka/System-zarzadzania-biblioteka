import { useMutation } from "@tanstack/react-query";
import { userApi } from "../../api/user/user.api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUnban = () => {

        const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userApi.unban(id),

        onSuccess: (message) => {
                queryClient.invalidateQueries({ queryKey: ["users"] });
                toast.success('User has been unbaned')
                console.log(message);
            },
        onError: (error) => {
            toast.error('Could not unban user')
            console.error(error);
        },
    });
};