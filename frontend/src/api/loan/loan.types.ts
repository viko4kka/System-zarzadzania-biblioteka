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