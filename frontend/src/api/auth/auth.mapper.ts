// zmienia wygląd danych otrzymanych z backendu na modele używane na frontednzie
import type {
  ApiLoginResponseDto,
  ApiRegisterResponseDto,
  User,
} from "./auth.types";

// mapowanie loginu
export const mapLoginResponse = (
  dto: ApiLoginResponseDto,
): { user: User; message: string } => ({
  user: {
    id: dto.data.id,
    name: dto.data.name,
    isAdmin: dto.data.is_Admin,
    isBanned: dto.data.is_Banned,
  },
  message: dto.message,
});

// mapowanie rejestracji
export const mapRegisterResponse = (
  dto: ApiRegisterResponseDto,
): { registeredUser: { id: string; name: string }; message: string } => ({
  registeredUser: {
    id: dto.id,
    name: dto.name,
  },
  message: "Registration successful",
});
