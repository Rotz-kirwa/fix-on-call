import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole =
  | "driver"
  | "mechanic"
  | "admin"
  | "super_admin"
  | "support_agent"
  | "finance"
  | "dispatch"
  | "partner_manager";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  vehicleInfo?: {
    make?: string;
    model?: string;
    year?: number;
    license_plate?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(persist(
  (set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    login: (user, token) => {
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    },
    setUser: (user) => set({ user }),
  }),
  {
    name: 'auth-storage',
  }
));
