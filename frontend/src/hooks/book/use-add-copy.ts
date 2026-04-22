import { useMutation } from "@tanstack/react-query";
import { bookApi } from "../../api/book/book.api";
import type { AddCopyDto } from "../../api/book/book.types";

export const useAddCopy = () => {
    return useMutation({
        mutationFn: (data: AddCopyDto) => bookApi.copyAdd(data),

        onSuccess: (message) => {
            console.log(message);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};