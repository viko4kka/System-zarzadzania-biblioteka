import { api } from "../api";
import type { 
    BookActionDto, 
    LoanBookResponseDto, 
    ReturnBookResponseDto 
} from "./loan.types";
import { mapLoanBookResponse, mapReturnBookResponse } from "./loan.mapper";

const baseURL = "/loan";

export const loanApi = {
    loanBook: async (data: BookActionDto): Promise<{ copyId: string, startDate: Date }> => {
        const response = await api.post<LoanBookResponseDto>(`${baseURL}/loanBook/`, data);
        return mapLoanBookResponse(response);
    },

    returnBook: async (data: BookActionDto): Promise<{ copyId: string, returnDate: Date }> => {
        const response = await api.patch<ReturnBookResponseDto>(`${baseURL}/returnBook/`, data);
        return mapReturnBookResponse(response);
    },
};