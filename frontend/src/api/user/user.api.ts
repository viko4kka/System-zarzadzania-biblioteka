import { api } from "../api";
import type { 
    BanUnbanResponseDto,
    MakeAdminResponseDto, 
    User, 
    UserData, 
    UserDataResponseDto, 
    UsersListParams, 
    UsersListResponseDto,
    UsersMeta
} from "./user.types";
import { mapBanUnbanResponse, mapMakeAdminResponse, mapUserDataResponse, mapUsersListResponse } from "./user.mapper";

const baseURL = "/api/user";

export const userApi = {
    makeAdmin: async (id: string): Promise<{ 
        data: { name: string, id: string, isAdmin: boolean }, 
        message: string  
    }> => {
        const response = await api.patch<MakeAdminResponseDto>(`${baseURL}/${id}/makeAdmin`);
        return mapMakeAdminResponse({data: response, message: ''});
    },

    ban: async (id: string): Promise<{ 
        data: { name: string, id: string, isBanned: boolean }, 
        message: string  
    }> => {
        
        const response = await api.patch<BanUnbanResponseDto>(`${baseURL}/${id}/ban`);
        return mapBanUnbanResponse({data: response, message: ''});
    },

    unban: async (id: string): Promise<{ 
        data: { name: string, id: string, isBanned: boolean }, 
        message: string  
    }> => {
        const response = await api.patch<BanUnbanResponseDto>(`${baseURL}/${id}/unban`);
        return mapBanUnbanResponse({data: response, message: ''});
    },

usersList: async (params: UsersListParams): Promise<{ users: User[], meta: UsersMeta }> => {
    const response = await api.get<UsersListResponseDto>(`${baseURL}/`, params);
    return {
        ...mapUsersListResponse(response),
        meta: response.meta,
    };
},

    user: async (id: string): Promise<UserData> => {
        const response = await api.get<UserDataResponseDto>(`${baseURL}/${id}`);
        return mapUserDataResponse(response);
    },
    loggedInUser: async (): Promise<UserData> => {
        
        const response = await api.get<UserDataResponseDto>(`${baseURL}`);
        return mapUserDataResponse(response);
    },
    updateUser: async (
        newName: string,
        newLastname: string,
        oldPassword: string,
        newPassword: string
    ): Promise<UserData> => {
        const response = await api.patch<UserDataResponseDto>(`${baseURL}/updateUser`, {
            name: newName,
            lastname: newLastname,
            oldpassword: oldPassword,
            newpassword: newPassword
        });

        return mapUserDataResponse(response);
    },
};
