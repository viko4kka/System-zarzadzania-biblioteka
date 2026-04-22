import { useMutation } from "@tanstack/react-query";
import { bookApi } from "../../api/book/book.api";
import type { AddAuthorDto } from "../../api/book/book.types";

export const useAddAuthor = () => {
    return useMutation({
        mutationFn: (data: AddAuthorDto) => bookApi.addAuthor(data),

        onSuccess: (message) => {
            console.log(message);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};