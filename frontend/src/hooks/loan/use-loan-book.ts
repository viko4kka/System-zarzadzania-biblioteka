import { useMutation } from "@tanstack/react-query";
import type { BookActionDto } from "../../api/loan/loan.types";
import { loanApi } from "../../api/loan/loan.api";

export const useLoanBook = () => {
    return useMutation({
        mutationFn: (data: BookActionDto) => loanApi.loanBook(data),

        onSuccess: (message) => {
            console.log(message);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};