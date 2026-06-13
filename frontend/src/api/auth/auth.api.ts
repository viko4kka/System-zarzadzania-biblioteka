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
import { mapLoginResponse, mapRegisterResponse } from "./auth.mapper";

const baseURL = "/api/auth";

export const authApi = {
  login: async (data: LoginDto): Promise<{ user: User; message: string }> => {
    const response = await api.post<ApiLoginResponseDto>(
      `${baseURL}/login`,
      data,
    );
    return mapLoginResponse(response);
  },

  register: async (
    data: RegisterDto,
  ): Promise<{
    registeredUser: { id: string; name: string };
    message: string;
  }> => {
    const response = await api.post<ApiRegisterResponseDto>(
      `${baseURL}/register`,
      data,
    );
    return mapRegisterResponse(response);
  },

  logout: async (): Promise<void> => {
    const response = await api.post<void>(`${baseURL}/logout`);
    return response;
  },

  removeUser: async (id: string | null, data: RemoveUserDto | null): Promise<string> => {
    if(id){
   //console.log('remove id: ', id)
       const response = await api.patch<ApiRemoveUserResponseDto>(
      `${baseURL}/removeUser/${id}`,
    );
    //console.log('remove: ', response)
    return response.message;
   }
   
    //console.log('remove: ', response)
     const response = await api.patch<ApiRemoveUserResponseDto>(
      `${baseURL}/removeUser`,
      data
    );
    //console.log('remove: ', response)
    return response.message;

  },
};
