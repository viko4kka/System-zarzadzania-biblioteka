import type {
    LoanBookResponseDto,
    ReturnBookResponseDto,
} from "./loan.types";

export const mapLoanBookResponse = (dto: LoanBookResponseDto): { copyId: string, startDate: Date } => ({
    copyId: dto.copy_id,
    startDate: new Date(dto.start_date),
});

export const mapReturnBookResponse = (dto: ReturnBookResponseDto): { copyId: string, returnDate: Date } => ({
    copyId: dto.copy_id,
    returnDate: new Date(dto.return_date),
});