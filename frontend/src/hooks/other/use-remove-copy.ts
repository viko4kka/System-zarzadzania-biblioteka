import { useMutation } from "@tanstack/react-query";
import type { RemoveCopyDto } from "../../api/other/other.types";
import { otherApi } from "../../api/other/other.api";

export const useRemoveCopy = () => {
    return useMutation({
        mutationFn: (data: RemoveCopyDto) => otherApi.copyRemove(data),

        onSuccess: (message) => {
            console.log(message);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};