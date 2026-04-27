// Wygląd danych wysyłanych i otrzymywanych z backendu
// Requesty do backendu
export interface LoginDto {
  mail: string;
  password: string;
}

export interface RegisterDto {
  mail: string;
  password: string;
  name: string;
  lastname: string;
}

export interface RemoveUserDto {
  password: string;
}

// Response z backendu (część data)
export interface LoginResponseDto {
  name: string;
  id: string;
  is_Admin: boolean;
  is_Banned: boolean;
}

export interface RegisterResponseDto {
  id: string;
  name: string;
}

// Cała odpowiedź backendu (data + message)
export interface ApiLoginResponseDto {
  message: string;
  data: LoginResponseDto;
}

export interface ApiRegisterResponseDto {
  id: string;
  name: string;
}

export interface ApiRemoveUserResponseDto {
  message: string;
}

// Frontendowe modele
export interface User {
  id: string;
  name: string;
  isAdmin: boolean;
  isBanned: boolean;
}
