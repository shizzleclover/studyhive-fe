import { apiClient } from '../client';
import {
    ApiResponse,
    AuthResponse,
    LoginRequest,
    SignupRequest,
    RefreshTokenRequest,
    VerifyEmailRequest,
    ResendVerificationRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    User,
} from '../types';

export const authService = {
    /**
     * Register a new user
     * POST /api/auth/signup
     */
    async signup(data: SignupRequest): Promise<AuthResponse> {
        const response = await apiClient.post<any>('/api/auth/signup', data);

        console.log('Auth service - signup response:', response.data);

        // Backend returns tokens at both root and data levels
        const accessToken = response.data.accessToken ?? response.data.data?.accessToken;
        const refreshToken = response.data.refreshToken ?? response.data.data?.refreshToken;
        const user = response.data.data?.user ?? response.data.user;

        if (!accessToken || !refreshToken) {
            console.error('Missing tokens in signup response:', response.data);
            throw new Error('Invalid response from server: Missing tokens');
        }

        return {
            accessToken,
            refreshToken,
            user: user as User,
        };
    },

    /**
     * Login user
     * POST /api/auth/login
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<any>('/api/auth/login', data);

        console.log('Auth service - full response:', response.data);

        // Backend returns tokens at both root and data levels
        // Prefer root level, fallback to data level
        const accessToken = response.data.accessToken ?? response.data.data?.accessToken;
        const refreshToken = response.data.refreshToken ?? response.data.data?.refreshToken;
        const user = response.data.data?.user ?? response.data.user;

        console.log('Extracted tokens:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            hasUser: !!user,
            userId: user?._id
        });

        if (!accessToken || !refreshToken) {
            console.error('Missing tokens in response:', response.data);
            throw new Error('Invalid response from server: Missing tokens');
        }

        return {
            accessToken,
            refreshToken,
            user: user as User,
        };
    },

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    async refresh(data: RefreshTokenRequest): Promise<{ accessToken: string }> {
        const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
            '/api/auth/refresh',
            data
        );
        return response.data.data!;
    },

    /**
     * Verify email with 6-digit OTP
     * POST /api/auth/verify-email
     */
    async verifyEmail(data: VerifyEmailRequest): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.post<ApiResponse>(
            '/api/auth/verify-email',
            data
        );
        return {
            success: response.data.success,
            message: response.data.message || 'Email verified successfully',
        };
    },

    /**
     * Resend verification OTP
     * POST /api/auth/resend-verification
     */
    async resendVerification(data: ResendVerificationRequest): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.post<ApiResponse>(
            '/api/auth/resend-verification',
            data
        );
        return {
            success: response.data.success,
            message: response.data.message || 'Verification email sent',
        };
    },

    /**
     * Request password reset
     * POST /api/auth/forgot-password
     */
    async forgotPassword(data: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.post<ApiResponse>(
            '/api/auth/forgot-password',
            data
        );
        return {
            success: response.data.success || true,
            message: response.data.message || 'Password reset email sent',
        };
    },

    /**
     * Reset password with token
     * POST /api/auth/reset-password
     */
    async resetPassword(data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.post<ApiResponse>(
            '/api/auth/reset-password',
            data
        );
        return {
            success: response.data.success || true,
            message: response.data.message || 'Password reset successfully',
        };
    },

    /**
     * Logout user
     * POST /api/auth/logout
     */
    async logout(): Promise<void> {
        await apiClient.post('/api/auth/logout');
    },

    /**
     * Change password (authenticated)
     * POST /api/auth/change-password
     */
    async changePassword(data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.post<ApiResponse>(
            '/api/auth/change-password',
            data
        );
        return {
            success: response.data.success || true,
            message: response.data.message || 'Password changed successfully',
        };
    },

    /**
     * Get current user
     * GET /api/auth/me
     */
    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<any>('/api/auth/me');

        console.log('getCurrentUser response:', response.data);

        // Backend might return user at different levels
        const user = response.data.data?.user ?? response.data.data ?? response.data.user ?? response.data;

        console.log('Extracted user:', user);

        if (!user || !user._id) {
            console.error('Invalid user object received:', response.data);
            throw new Error('Invalid user data from server');
        }

        return user as User;
    },
};
