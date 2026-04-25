import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookApi } from "../../api/book/book.api";
import type { AddBookDto } from "../../api/book/book.types";

export const useAddBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddBookDto) => bookApi.addBook(data),

        onSuccess: (message) => {
            console.log(message);
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: (error) => {
            console.error(error);
        },
    });
};