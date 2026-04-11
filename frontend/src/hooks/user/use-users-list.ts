import { useQuery } from "@tanstack/react-query";
import { userApi } from "../../api/user/user.api";
import type { UsersListParams } from "../../api/user/user.types";

export const useUsersList = (params: UsersListParams) => {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => userApi.usersList(params),

        placeholderData: (prev) => (prev)
    });
};