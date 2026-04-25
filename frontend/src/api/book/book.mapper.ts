import type { 
    AddAuthorResponseDto,
    AddBookResponseDto, 
    AddPublisherResponseDto, 
    Book, BookData, 
    BookDataResponseDto,
    BookDto,
    BooksListResponseDto, 
} from "./book.types";

export const mapAdd = (dto: AddBookResponseDto): { id: string, title: string } => ({
    id: dto.id,
    title: dto.title
});

const mapBook = (dto: BookDto): Book => ({
    title: dto.title,
});

export const mapBooksListResponse = (dto: BooksListResponseDto): { books: Book[] } => ({
    books: dto.book_list.map(mapBook),
});

export const mapBookDataResponse = (dto: BookDataResponseDto): BookData => ({
    title: dto.title,
    year: dto.year,
    cover: dto.cover,
    publisherId: dto.publisher_id,
    ISBN: dto.ISBN,
    numberOfCopies: dto.number_of_copies
});

export const mapAddPublisherResponse = (dto: AddPublisherResponseDto): { id: string, publisherName: string } => ({
    id: dto.id,
    publisherName: dto.publisher_name
});

export const mapAddAuthorResponse = (dto: AddAuthorResponseDto): { id: string, authorName: string } => ({
    id: dto.id,
    authorName: dto.author_name
});