import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RemoveBookDto } from "../../api/book/book.types";
import { bookApi } from "../../api/book/book.api";

export const useRemoveBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RemoveBookDto) => bookApi.removeBook(data),

        onSuccess: (message) => {
            console.log(message);
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: (error) => {
            console.error(error);
        },
    });
};