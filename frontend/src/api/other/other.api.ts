import { api } from "../api";
import type { 
    AddAuthorDto, 
    AddAuthorResponseDto, 
    AddCopyDto,
    AddCopyResponseDto, 
    AddPublisherDto, 
    AddPublisherResponseDto, 
    ApiRemoveCopyResponseDto, 
    RemoveCopyDto 
} from "./other.types";
import { mapAddAuthorResponse, mapAddPublisherResponse } from "./other.mapper";

export const otherApi = {
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
};