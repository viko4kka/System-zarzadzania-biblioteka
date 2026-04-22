import { useMutation } from "@tanstack/react-query";
import { bookApi } from "../../api/book/book.api";
import type { RemoveCopyDto } from "../../api/book/book.types";

export const useRemoveCopy = () => {
    return useMutation({
        mutationFn: (data: RemoveCopyDto) => bookApi.copyRemove(data),

        onSuccess: (message) => {
            console.log(message);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};