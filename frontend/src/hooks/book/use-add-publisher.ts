import { useMutation } from "@tanstack/react-query";
import { bookApi } from "../../api/book/book.api";
import type { AddPublisherDto } from "../../api/book/book.types";
export const useAddPublisher = () => {
    return useMutation({
        mutationFn: (data: AddPublisherDto) => bookApi.addPublisher(data),

        onSuccess: (message) => {
            console.log(message);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};