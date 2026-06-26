import { api } from "../api";
import { mapLoanBookResponse, mapLoansResponse, mapReturnBookResponse } from "./loan.mapper";
import type {
    ActiveLoansDto,
    ActiveLoansParams,
    LoanBookResponseDto,
    LoanData,
    LoansMeta,
    ReturnBookResponseDto
} from "./loan.types";

const baseURL = "/api/loan";

export const loanApi = {
  loanBook: async (
    bookId: string,
  ): Promise<{ copyId: string; startDate: Date }> => {
    const response = await api.post<LoanBookResponseDto>(
      `${baseURL}/loanBook/${bookId}`,
    );
    return mapLoanBookResponse(response);
  },

  returnBook: async (
    copy_id: string,
  ): Promise<{ copyId: string; returnDate: Date }> => {
    const response = await api.patch<ReturnBookResponseDto>(
      `${baseURL}/returnBook/${copy_id}`,
    );
    return mapReturnBookResponse(response);
  },
  activeLoans: async (params: ActiveLoansParams): Promise<ActiveLoansDto> => {
    const response = await api.get<ActiveLoansDto>(
      `${baseURL}/ActiveLoans`,
      params,
    );
    return response;
  },
  loans: async (params: ActiveLoansParams): Promise<{ loans: LoanData[], meta: LoansMeta }> => {
        const response = await api.get<ActiveLoansDto>(`${baseURL}/loans`, params);
        return mapLoansResponse(response)
    },
};
