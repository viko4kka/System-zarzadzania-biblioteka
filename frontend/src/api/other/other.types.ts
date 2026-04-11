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
}

//Response (only data)
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