import { api } from "../api";
import type { 
    AddBookDto, 
    AddBookResponseDto, 
    Book, 
    BookData, 
    BookDataResponseDto, 
    BooksListParams, 
    BooksListResponseDto, 
    RemoveBookDto, 
    RemoveBookResponseDto 
} from "./book.types";
import { mapAdd, mapBookDataResponse, mapBooksListResponse } from "./book.mapper";

const baseURL = "/book";

export const bookApi = {
    addBook: async (data: AddBookDto): Promise<{ id: string, title: string }> => {
        const response = await api.post<AddBookResponseDto>(`${baseURL}/add`, data);
        return mapAdd(response);
    },

    removeBook: async (data: RemoveBookDto): Promise<string> => {
        const response = await api.patch<RemoveBookResponseDto>(`${baseURL}/remove`, data);
        return response.message;
    },
    
    booksList: async (params: BooksListParams): Promise<{ books: Book[] }> => {
        const response = await api.get<BooksListResponseDto>(`${baseURL}/`, params);
        return mapBooksListResponse(response);
    },

    bookData: async (id: string): Promise<BookData> => {
        const response = await api.get<BookDataResponseDto>(`${baseURL}/${id}`);
        return mapBookDataResponse(response);
    },
};