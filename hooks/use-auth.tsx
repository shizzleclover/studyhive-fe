import { create } from "zustand";
import { studyHiveApi } from "@/lib/studyhive-data";

type AuthStore = {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export const useAuth = create<AuthStore>((set, get) => {
  // Check if user is authenticated on initialization
  const checkAuth = () => {
    try {
      const user = studyHiveApi.auth.getCurrentUser();
      set({ isAuthenticated: !!user, isLoading: false });
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  };

  // Initialize auth state
  if (typeof window !== "undefined") {
    checkAuth();
  }

  return {
    isAuthenticated: false,
    isLoading: true,
    checkAuth,
    login: async (email: string, password: string) => {
      try {
        studyHiveApi.auth.login(email, password);
        set({ isAuthenticated: true, isLoading: false });
        return true;
      } catch (error) {
        set({ isAuthenticated: false, isLoading: false });
        return false;
      }
    },
    signup: async (name: string, email: string, password: string) => {
      try {
        studyHiveApi.auth.signup(name, email, password);
        set({ isAuthenticated: true, isLoading: false });
        return true;
      } catch (error) {
        set({ isAuthenticated: false, isLoading: false });
        return false;
      }
    },
    logout: () => {
      studyHiveApi.auth.logout();
      set({ isAuthenticated: false, isLoading: false });
    },
  };
});

