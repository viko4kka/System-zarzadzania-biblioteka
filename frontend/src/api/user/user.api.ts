import { api } from "../api";
import type { 
    ApiBanUnbanResponseDto,
    ApiMakeAdminResponseDto, 
    User, 
    UserData, 
    UserDataResponseDto, 
    UsersListParams, 
    UsersListResponseDto
} from "./user.types";
import { mapBanUnbanResponse, mapMakeAdminResponse, mapUserDataResponse, mapUsersListResponse } from "./user.mapper";

const baseURL = "/api/user";

export const userApi = {
    makeAdmin: async (id: string): Promise<{ 
        data: { name: string, id: string, isAdmin: boolean }, 
        message: string  
    }> => {
        const response = await api.patch<ApiMakeAdminResponseDto>(`${baseURL}/${id}/makeAdmin`);
        return mapMakeAdminResponse(response);
    },

    ban: async (id: string): Promise<{ 
        data: { name: string, id: string, isBanned: boolean }, 
        message: string  
    }> => {
        const response = await api.patch<ApiBanUnbanResponseDto>(`${baseURL}/${id}/ban`);
        return mapBanUnbanResponse(response);
    },

    unban: async (id: string): Promise<{ 
        data: { name: string, id: string, isBanned: boolean }, 
        message: string  
    }> => {
        const response = await api.patch<ApiBanUnbanResponseDto>(`${baseURL}/${id}/unban`);
        return mapBanUnbanResponse(response);
    },

    usersList: async (params: UsersListParams): Promise<{ users: User[] }> => {
        const response = await api.get<UsersListResponseDto>(`${baseURL}/`, params);
        return mapUsersListResponse(response);
    },

    user: async (id: string): Promise<UserData> => {
        const response = await api.get<UserDataResponseDto>(`${baseURL}/${id}`);
        return mapUserDataResponse(response);
    },
    loggedInUser: async (): Promise<UserData> => {
        
        const response = await api.get<UserDataResponseDto>(`${baseURL}`);
        return mapUserDataResponse(response);
    },
};