import { useQuery } from "@tanstack/react-query";
import { bookApi } from "../../api/book/book.api";

export const useHealthStatus = () => {
    return useQuery({
        queryKey: ['health'],
        queryFn: () => bookApi.healthStatus(),
        staleTime: 0,
    });
};