import { useQuery } from "@tanstack/react-query";
import { loanApi } from "../../api/loan/loan.api";
import type { ActiveLoansParams } from "../../api/loan/loan.types";

export const useActiveLoans = (params: ActiveLoansParams) => {
    return useQuery({
        queryKey: ["activeLoans", params],
        queryFn: () => loanApi.activeLoans(params),
        placeholderData: (prev) => (prev)
    });
};