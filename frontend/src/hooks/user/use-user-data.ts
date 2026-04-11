import { useQuery } from "@tanstack/react-query";
import { userApi } from "../../api/user/user.api";

export const useUserData = (id: string) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => userApi.user(id),
        enabled: !!id,
    });
};