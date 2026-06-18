export interface BookActionDto {
    copy_id: string;
}

//Response (data only)
export interface BookActionResponseDto {
    copy_id: string;
}

export interface LoanBookResponseDto extends BookActionResponseDto {
    start_date: Date;
}

export interface ReturnBookResponseDto extends BookActionResponseDto {
    return_date: Date;
}

export interface LoansMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface LoansAuthorDto{
    id_author: string;
    author_name: string;
    author_lastname:string
}

export interface LoanBookDto {
            id: string;
            title: string;
            cover: string;
            ISBN: string;
            authors: LoansAuthorDto[];
}

export interface LoanCopyDto{
        copy_id: string;
        book: LoanBookDto
}

export interface LoanDto{
    id_loan: number;
    copy_id: string;
    start_date: Date
    return_date: Date | null
    copy: LoanCopyDto
}

export interface ActiveLoansDto {
    data: LoanDto[]
    meta: LoansMeta
} 

export interface ActiveLoansParams {
    page:number;
    limit: number;
}