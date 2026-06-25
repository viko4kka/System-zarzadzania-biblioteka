import type {
  AddAuthorResponseDto,
  AddBookResponseDto,
  AddPublisherResponseDto,
  Book,
  BookData,
  BookDataResponseDto,
  BookDto,
  BooksListResponseDto,
} from "./book.types";

export const mapAdd = (
  dto: AddBookResponseDto,
): { id: string; title: string } => ({
  id: dto.id,
  title: dto.title,
});

const mapBook = (dto: BookDto): Book => ({
  id_book: dto.id_book,
  title: dto.title,
  year: dto.year,
  ISBN: dto.ISBN,
  cover: dto.cover,
  authors: dto.authors
    ? dto.authors.map((a) => ({
        id_author: a.id_author,
        author_name: a.author_name,
        author_lastname: a.author_lastname,
      }))
    : [],
  publisher: dto.publisher,
  availableCopies: dto.availableCopies ?? 0,
  totalCopies: dto.totalCopies ?? 0,
});

export const mapBooksListResponse = (
  dto: BooksListResponseDto,
): {
  books: Book[];
  meta: { page: number; limit: number; total: number; totalPages: number };
} => ({
  books: dto.data.map(mapBook),
  meta: dto.meta,
});

export const mapBookDataResponse = (dto: BookDataResponseDto): BookData => ({
  title: dto.title,
  year: dto.year,
  cover: dto.cover,
  publisherId: dto.publisher_id?.toString() || "",
  publisherName: dto.publisher?.publisher_name || "",
  ISBN: dto.ISBN,
  totalCopies: dto.totalCopies ?? 0,
  availableCopies: dto.availableCopies ?? 0,

  authors: dto.authors
    ? dto.authors.map((author) => ({
        author_name: author.author_name,
        author_lastname: author.author_lastname,
      }))
    : [],
});

export const mapAddPublisherResponse = (
  dto: AddPublisherResponseDto,
): { id: string; publisherName: string } => ({
  id: dto.id,
  publisherName: dto.publisher_name,
});

export const mapAddAuthorResponse = (
  dto: AddAuthorResponseDto,
): { id: string; authorName: string } => ({
  id: dto.id,
  authorName: dto.author_name,
});
