export interface AddBookDto {
    title: string;
    year: number;
    publisher_name: string;
    authors: AddAuthorDto[];
    cover?: string;
    ISBN?: string;  
}

export interface RemoveBookDto {
    id: string;
}

export interface BooksListParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface AddPublisherDto {
    publisher_name: string;
}

export interface AddCopyDto {
    book_id: string;
}

export interface RemoveCopyDto {
    id: string;
}

export interface AddAuthorDto {
    author_name: string;
    author_lastname: string;
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
    ISBN: string;
    number_of_copies: number;
    
    publisher_id: string | number; 

    id_book?: number;
    publisher?: {
        id_publisher: number;
        publisher_name: string;
    };
    authors?: {
        id_author: number;
        author_name: string;
        author_lastname: string;
    }[];
    total_copies?: number;
    available_copies?: number;
}

export interface AddPublisherResponseDto {
    id: string;
    publisher_name: string;
}

export interface AddCopyResponseDto {
    id: string;
}

export interface AddAuthorResponseDto {
    id: string;
    author_name: string;
}

//Response (data + messenge + itp.)
export interface ApiRemoveCopyResponseDto {
    message: string;
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
    publisherName?: string; 
    ISBN: string;
    numberOfCopies: number;
    authors?: { 
        author_name: string;
        author_lastname: string;
    }[];
}

