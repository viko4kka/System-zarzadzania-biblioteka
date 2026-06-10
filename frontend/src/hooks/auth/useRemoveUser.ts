import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth/auth.api";
import type { RemoveUserDto } from "../../api/auth/auth.types";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useRemoveUser = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string | null; data: RemoveUserDto |null }) => 
            authApi.removeUser(id, data),

        onSuccess: (message) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success('User has been removed')
            console.log(message);
        },
        onError: (error) => {
            toast.error('Could not remove user ')
            console.error(error);
        },
    });
};