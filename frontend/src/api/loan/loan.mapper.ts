import type {
    ActiveLoansDto,
    LoanBookResponseDto,
    LoanData,
    LoanDto,
    LoansMeta,
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

const mapLoan = (dto: LoanDto): LoanData => ({
    id_loan: dto.id_loan,
    copy_id: dto.copy_id,
    start_date: new Date(dto.start_date),
    return_date: 
        dto.return_date !== null
            ? new Date(dto.return_date)
            : null,
    book: {
        id: dto.copy.book.id,
        title: dto.copy.book.title,
        cover: dto.copy.book.cover,
        ISBN: dto.copy.book.ISBN,
        authors: dto.copy.book.authors
    }
});

export const mapLoansResponse = (dto: ActiveLoansDto): { loans: LoanData[], meta: LoansMeta } => ({
    loans: dto.data.map(mapLoan),
    meta: dto.meta
});