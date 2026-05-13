import type { User } from "../api/auth/auth.types";
import { create } from "zustand";

interface AuthStoreState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStoreState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
