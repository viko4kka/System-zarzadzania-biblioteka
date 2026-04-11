export interface AddBookDto {
    title: string;
    year: number;
    cover: string;
    publisher_id: string;
    ISBN: string;
}

export interface RemoveBookDto {
    id: string;
}

export interface BooksListParams {
    page?: number;
    limit?: number;
    search?: string;
}

//Response (only data)
export interface AddBookResponseDto {
    id: string;
    title: string;
}

export interface RemoveBookResponseDto {
    message: string;
}

export interface BookDto {
    title: string;
}

export interface BooksListResponseDto {
    book_list: BookDto[];
}

export interface BookDataResponseDto {
    title: string;
    year: number;
    cover: string;
    publisher_id: string;
    ISBN: string;
    number_of_copies: number;
}

//interface model
export interface Book {
    title: string;
}

export interface BookData {
    title: string;
    year: number;
    cover: string;
    publisherId: string;
    ISBN: string;
    numberOfCopies: number;
}