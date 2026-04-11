import { useMutation } from "@tanstack/react-query";
import type { AddCopyDto } from "../../api/other/other.types";
import { otherApi } from "../../api/other/other.api";

export const useAddCopy = () => {
    return useMutation({
        mutationFn: (data: AddCopyDto) => otherApi.copyAdd(data),

        onSuccess: (message) => {
            console.log(message);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};