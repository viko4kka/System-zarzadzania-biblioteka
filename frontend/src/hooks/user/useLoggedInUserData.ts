import { useQuery } from "@tanstack/react-query";
import { userApi } from "../../api/user/user.api";

export const useLoggedInUserData = () => {
    const query = useQuery({
        queryKey: ["user"],
        queryFn: () => userApi.loggedInUser(),
        retry: false,
    });
  

    return {
        user: query.data,        
        isLoading: query.isLoading, 
        isError: query.isError,   
        error: query.error,       
        isUnauthorized: query.isError && (query.error as any).statusCode === 401          
    };
};