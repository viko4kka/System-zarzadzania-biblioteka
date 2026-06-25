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
  id_book: number;
  title: string;
  year: number;
  cover: string;
  ISBN: string;
  publisher_id?: string | number;
  publisher?: {
    id_publisher: number;
    publisher_name: string;
  };
  authors?: {
    id_author: number;
    author_name: string;
    author_lastname: string;
  }[];
  totalCopies?: number;
  availableCopies?: number;
}

export interface BookDataResponseDto {
  id_book: number;
  title: string;
  year: number;
  cover: string;
  ISBN: string;

  publisher_id: string | number;
  publisher?: {
    id_publisher: number;
    publisher_name: string;
  };
  authors?: {
    id_author: number;
    author_name: string;
    author_lastname: string;
  }[];

  totalCopies?: number;
  availableCopies?: number;
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
  id_book: number;
  title: string;
  year: number;
  cover: string;
  ISBN: string;

  publisher_id?: number;
  publisher?: {
    id_publisher: number;
    publisher_name: string;
  };

  authors: {
    id_author: number;
    author_name: string;
    author_lastname: string;
  }[];

  totalCopies: number;
  availableCopies: number;
}

export interface BookData {
  title: string;
  year: number;
  cover: string;
  publisherId: string;
  publisherName?: string;
  ISBN: string;
  totalCopies: number;
  availableCopies: number;
  authors?: {
    author_name: string;
    author_lastname: string;
  }[];
}

export interface BooksListMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BooksListResponseDto {
  data: BookDto[];
  meta: BooksListMetaDto;
}
