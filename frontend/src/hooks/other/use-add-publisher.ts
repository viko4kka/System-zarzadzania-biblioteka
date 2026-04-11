import { useMutation } from "@tanstack/react-query";
import type { AddPublisherDto } from "../../api/other/other.types";
import { otherApi } from "../../api/other/other.api";

export const useAddPublisher = () => {
    return useMutation({
        mutationFn: (data: AddPublisherDto) => otherApi.addPublisher(data),

        onSuccess: (message) => {
            console.log(message);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};