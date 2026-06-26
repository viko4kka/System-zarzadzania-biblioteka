import { useQuery } from "@tanstack/react-query";
import { loanApi } from "../../api/loan/loan.api";
import type { ActiveLoansParams } from "../../api/loan/loan.types";

export const useLoans = (params: ActiveLoansParams) => {
    return useQuery({
        queryKey: ["loans", params],
        queryFn: () => loanApi.loans(params),
        placeholderData: (prev) => (prev)
    });
};