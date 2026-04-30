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
    RemoveBookResponseDto,
    AddAuthorDto, 
    AddAuthorResponseDto, 
    AddCopyDto,
    AddCopyResponseDto, 
    AddPublisherDto, 
    AddPublisherResponseDto, 
    ApiRemoveCopyResponseDto, 
    RemoveCopyDto 
} from "./book.types";
import { 
    mapAdd, 
    mapBookDataResponse, 
    mapBooksListResponse,
    mapAddAuthorResponse, 
    mapAddPublisherResponse
 } from "./book.mapper";

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

    addPublisher: async (data: AddPublisherDto): Promise<{ id: string, publisherName: string }> => {
        const response = await api.post<AddPublisherResponseDto>(`/author/addAuthor`, data);
        return mapAddPublisherResponse(response);
    },

    copyAdd: async (data: AddCopyDto): Promise<{ id: string }> => {
        const response = await api.post<AddCopyResponseDto>(`/copy/add`, data);
        return { id: response.id };
    },

    copyRemove: async (data: RemoveCopyDto): Promise<string> => {
        const response = await api.patch<ApiRemoveCopyResponseDto>(`/copy/remove`, data);
        return response.message;
    },

    addAuthor: async (data: AddAuthorDto): Promise<{ id: string, authorName: string }> => {
        const response = await api.post<AddAuthorResponseDto>(`/publisher/addPublisher`, data);
        return mapAddAuthorResponse(response);
    },

    healthStatus: async (): Promise<string> => {
        const response = await api.get<{ status: string }>(`/health`);
        return response.status;
    },
};