import { api } from "../api";
import type {
    LoginDto,
    ApiLoginResponseDto,
    User,
    RegisterDto,
    RemoveUserDto,
    ApiRegisterResponseDto,
    ApiRemoveUserResponseDto,
} from "./auth.types";
import { mapLoginResponse,   mapRegisterResponse } from "./auth.mapper";

const baseURL = "/api/auth";

export const authApi = {
    login: async (data: LoginDto): Promise<{ user: User; message: string }> => {
        const response = await api.post<ApiLoginResponseDto>(`${baseURL}/login`, data);
        return mapLoginResponse(response);
    },

    register: async (data: RegisterDto): Promise<{ registeredUser: { id: string; name: string }; message: string }> => {
        const response = await api.post<ApiRegisterResponseDto>(`${baseURL}/register`, data);
        return mapRegisterResponse(response);
    },
    
    //TODO: endpoint for logout

    removeUser: async (id: string, data: RemoveUserDto): Promise<string> => {
        const response = await api.patch<ApiRemoveUserResponseDto>(`${baseURL}/removeUser/${id}`, data);
        return response.message;
    },
};