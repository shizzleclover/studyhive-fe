import { create } from "zustand";
import { authService } from "@/lib/api/services/auth.service";
import { tokenStorage } from "@/lib/token-storage";
import { User } from "@/lib/api/types";
import { AxiosError } from "axios";

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsVerification: boolean;
  verificationEmail: string | null;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; needsVerification?: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; needsVerification?: boolean; error?: string }>;
  logout: () => Promise<void>;
  verifyEmail: (otp: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string }>;
};

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  needsVerification: false,
  verificationEmail: null,

  checkAuth: async () => {
    try {
      // Check if tokens exist
      if (!tokenStorage.hasTokens()) {
        set({ isAuthenticated: false, isLoading: false, user: null });
        return;
      }

      // Try to fetch current user
      try {
        const user = await authService.getCurrentUser();
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          needsVerification: !user.isVerified
        });
      } catch (fetchError) {
        console.warn('Failed to fetch user on auth check, but tokens exist:', fetchError);
        // Tokens exist but user fetch failed - keep them authenticated
        // The dashboard/app will handle the missing user gracefully
        set({
          user: null,
          isAuthenticated: true, // Keep authenticated since tokens exist
          isLoading: false,
          needsVerification: false
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      tokenStorage.clearTokens();
      set({ isAuthenticated: false, isLoading: false, user: null });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      console.log('Login response full:', response);
      console.log('AccessToken to store:', response.accessToken);

      if (!response.accessToken || !response.refreshToken) {
        console.error('Missing tokens in response:', response);
        throw new Error('Invalid response from server: Missing tokens');
      }

      // Store tokens
      tokenStorage.setTokens(response.accessToken, response.refreshToken);

      let user = response.user;

      // If user object is missing from login response, try to fetch it
      if (!user) {
        try {
          console.log('User missing from login response, fetching from /me endpoint...');
          user = await authService.getCurrentUser();
        } catch (fetchError) {
          console.warn('Failed to fetch user details after login:', fetchError);
          // Don't throw - we'll handle missing user in the dashboard
        }
      }

      // If we still don't have a user, that's okay - route to dashboard anyway
      // The dashboard will handle the missing user case
      if (!user) {
        console.warn('User object unavailable - routing to dashboard for setup');
        set({
          user: null,
          isAuthenticated: true, // tokens are valid even if user data is missing
          isLoading: false,
          needsVerification: false
        });
        return { success: true };
      }

      // Check if email verification is needed (only if we have user data)
      if (!user.isVerified) {
        set({
          needsVerification: true,
          verificationEmail: email,
          user: user,
          isAuthenticated: false
        });
        return { success: true, needsVerification: true };
      }

      set({
        user: user,
        isAuthenticated: true,
        isLoading: false,
        needsVerification: false
      });
      return { success: true };
    } catch (error) {
      console.error('Login error details:', error);
      const axiosError = error as AxiosError<{ message: string }>;

      let errorMessage = 'An unexpected error occurred';

      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = axiosError.response.data?.message || 'Invalid credentials';
      } else if (axiosError.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your internet connection or try again later.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = axiosError.message;
      }

      set({ isAuthenticated: false, isLoading: false, user: null });
      return { success: false, error: errorMessage };
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      const response = await authService.signup({ name, email, password });

      // Store tokens
      tokenStorage.setTokens(response.accessToken, response.refreshToken);

      // Set state with verification needed
      set({
        needsVerification: true,
        verificationEmail: email,
        user: response.user,
        isAuthenticated: false
      });

      return { success: true, needsVerification: true };
    } catch (error) {
      console.error('Signup error details:', error);
      const axiosError = error as AxiosError<{ message: string }>;

      let errorMessage = 'An unexpected error occurred';

      if (axiosError.response) {
        errorMessage = axiosError.response.data?.message || 'Failed to create account';
      } else if (axiosError.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = axiosError.message;
      }

      set({ isAuthenticated: false, isLoading: false, user: null });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenStorage.clearTokens();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        needsVerification: false,
        verificationEmail: null
      });
    }
  },

  verifyEmail: async (otp: string) => {
    try {
      await authService.verifyEmail({ otp });

      // Fetch updated user
      const user = await authService.getCurrentUser();

      set({
        user,
        isAuthenticated: true,
        needsVerification: false,
        verificationEmail: null
      });

      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Invalid or expired OTP';
      return { success: false, error: errorMessage };
    }
  },

  resendVerification: async (email: string) => {
    try {
      await authService.resendVerification({ email });
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to resend verification email';
      return { success: false, error: errorMessage };
    }
  },
}));

// Initialize auth check on client side
if (typeof window !== 'undefined') {
  useAuth.getState().checkAuth();
}

