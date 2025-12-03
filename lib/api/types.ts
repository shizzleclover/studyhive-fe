// API Response Types

export interface ApiResponse<T = any> {
    statusCode?: number;
    success: boolean;
    message?: string;
    data?: T;
    stack?: string;
}

export interface ApiError {
    success: false;
    message: string;
    stack?: string;
}

// Pagination
export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Auth Types
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'rep' | 'admin';
    isVerified: boolean;
    profilePicture?: string;
    bio?: string;
    reputationScore: number;
    notesCreated: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    verificationOTP?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface VerifyEmailRequest {
    otp: string;
}

export interface ResendVerificationRequest {
    email: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    otp: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

// User Types
export interface UpdateProfileRequest {
    name?: string;
    bio?: string;
    profilePicture?: string;
}

export interface UserStats {
    notesCreated: number;
    notesSaved: number;
    quizzesTaken: number;
    reputationScore: number;
    rank?: number;
}

export interface SavedNote {
    _id: string;
    noteId: string;
    userId: string;
    savedAt: string;
}

export interface UpdateRoleRequest {
    role: 'student' | 'rep' | 'admin';
}

export interface AssignCoursesRequest {
    courseIds: string[];
}

export interface UpdateReputationRequest {
    score: number;
    reason?: string;
}
