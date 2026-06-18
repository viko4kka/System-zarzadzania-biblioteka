import { api } from "../api";
import type { 
    BookActionDto, 
    LoanBookResponseDto, 
    ReturnBookResponseDto ,
    ActiveLoansDto,
    ActiveLoansParams
} from "./loan.types";
import { mapLoanBookResponse, mapReturnBookResponse } from "./loan.mapper";

const baseURL = "/api/loan";

export const loanApi = {
    loanBook: async (data: BookActionDto): Promise<{ copyId: string, startDate: Date }> => {
        const response = await api.post<LoanBookResponseDto>(`${baseURL}/loanBook/`, data);
        return mapLoanBookResponse(response);
    },

    returnBook: async (copy_id: string): Promise<{ copyId: string, returnDate: Date }> => {
        const response = await api.patch<ReturnBookResponseDto>(`${baseURL}/returnBook/${copy_id}`);
        return mapReturnBookResponse(response);
    },
    activeLoans: async (params: ActiveLoansParams): Promise<ActiveLoansDto> => {
        const response = await api.get<ActiveLoansDto>(`${baseURL}/ActiveLoans`, params);
        return response
    },
};