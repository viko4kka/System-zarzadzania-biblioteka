import { useMutation } from "@tanstack/react-query";
import type { AddAuthorDto } from "../../api/other/other.types";
import { otherApi } from "../../api/other/other.api";

export const useAddAuthor = () => {
    return useMutation({
        mutationFn: (data: AddAuthorDto) => otherApi.addAuthor(data),

        onSuccess: (message) => {
            console.log(message);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};