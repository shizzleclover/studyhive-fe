import { apiClient } from '../client';
import {
    ApiResponse,
    User,
    UserStats,
    UpdateProfileRequest,
    SavedNote,
    UpdateRoleRequest,
    AssignCoursesRequest,
    UpdateReputationRequest,
} from '../types';

export const userService = {
    /**
     * Get user by ID
     * GET /api/users/{id}
     */
    async getUserById(id: string): Promise<User> {
        const response = await apiClient.get<ApiResponse<User>>(`/api/users/${id}`);
        return response.data.data!;
    },

    /**
     * Get user statistics
     * GET /api/users/{id}/stats
     */
    async getUserStats(id: string): Promise<UserStats> {
        const response = await apiClient.get<ApiResponse<UserStats>>(`/api/users/${id}/stats`);
        return response.data.data!;
    },

    /**
     * Update current user's profile
     * PUT /api/users/profile
     */
    async updateProfile(data: UpdateProfileRequest): Promise<User> {
        const response = await apiClient.put<ApiResponse<User>>('/api/users/profile', data);
        return response.data.data!;
    },

    /**
     * Save a community note
     * POST /api/users/notes/{noteId}/save
     */
    async saveNote(noteId: string): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.post<ApiResponse>(`/api/users/notes/${noteId}/save`);
        return {
            success: response.data.success,
            message: response.data.message || 'Note saved successfully',
        };
    },

    /**
     * Unsave a community note
     * DELETE /api/users/notes/{noteId}/save
     */
    async unsaveNote(noteId: string): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.delete<ApiResponse>(`/api/users/notes/${noteId}/save`);
        return {
            success: response.data.success,
            message: response.data.message || 'Note unsaved successfully',
        };
    },

    /**
     * Get current user's saved notes
     * GET /api/users/saved-notes
     */
    async getSavedNotes(): Promise<SavedNote[]> {
        const response = await apiClient.get<ApiResponse<SavedNote[]>>('/api/users/saved-notes');
        return response.data.data!;
    },

    /**
     * Get all users (admin only)
     * GET /api/users
     */
    async getAllUsers(): Promise<User[]> {
        const response = await apiClient.get<ApiResponse<User[]>>('/api/users');
        return response.data.data!;
    },

    /**
     * Update user role (admin only)
     * PATCH /api/users/{id}/role
     */
    async updateUserRole(id: string, data: UpdateRoleRequest): Promise<User> {
        const response = await apiClient.patch<ApiResponse<User>>(`/api/users/${id}/role`, data);
        return response.data.data!;
    },

    /**
     * Deactivate user (admin only)
     * PATCH /api/users/{id}/deactivate
     */
    async deactivateUser(id: string): Promise<User> {
        const response = await apiClient.patch<ApiResponse<User>>(`/api/users/${id}/deactivate`);
        return response.data.data!;
    },

    /**
     * Activate user (admin only)
     * PATCH /api/users/{id}/activate
     */
    async activateUser(id: string): Promise<User> {
        const response = await apiClient.patch<ApiResponse<User>>(`/api/users/${id}/activate`);
        return response.data.data!;
    },

    /**
     * Assign courses to a user (admin only)
     * POST /api/users/{id}/assign-courses
     */
    async assignCourses(id: string, data: AssignCoursesRequest): Promise<User> {
        const response = await apiClient.post<ApiResponse<User>>(`/api/users/${id}/assign-courses`, data);
        return response.data.data!;
    },

    /**
     * Update user reputation score (admin only)
     * POST /api/users/{id}/update-reputation
     */
    async updateReputation(id: string, data: UpdateReputationRequest): Promise<User> {
        const response = await apiClient.post<ApiResponse<User>>(`/api/users/${id}/update-reputation`, data);
        return response.data.data!;
    },
};
