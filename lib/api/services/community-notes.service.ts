import { apiClient } from '../client';
import {
    ApiResponse,
    CommunityNote,
    CommunityNotesParams,
    CommunityNotesResponse,
    CreateNoteRequest,
    UpdateNoteRequest,
    PinNoteRequest,
} from '../types';

export const communityNotesService = {
    /**
     * Get all community notes with pagination and sorting
     * GET /api/community-notes
     */
    async getAllNotes(params?: CommunityNotesParams): Promise<CommunityNotesResponse> {
        const response = await apiClient.get<ApiResponse<CommunityNotesResponse>>('/api/community-notes', {
            params: {
                page: params?.page || 1,
                limit: params?.limit || 10,
                sortBy: params?.sortBy || 'recent',
                courseId: params?.courseId,
                status: params?.status,
            },
        });
        return response.data.data!;
    },

    /**
     * Create a new community note
     * POST /api/community-notes
     */
    async createNote(data: CreateNoteRequest): Promise<CommunityNote> {
        const response = await apiClient.post<ApiResponse<CommunityNote>>('/api/community-notes', data);
        return response.data.data!;
    },

    /**
     * Get all community notes for a specific course
     * GET /api/community-notes/course/{courseId}
     */
    async getNotesByCourse(courseId: string, params?: CommunityNotesParams): Promise<CommunityNotesResponse> {
        const response = await apiClient.get<ApiResponse<CommunityNotesResponse>>(
            `/api/community-notes/course/${courseId}`,
            {
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    sortBy: params?.sortBy || 'recent',
                    status: params?.status,
                },
            }
        );
        return response.data.data!;
    },

    /**
     * Get all notes created by a specific user
     * GET /api/community-notes/user/{userId}
     */
    async getNotesByUser(userId: string, params?: { page?: number; limit?: number }): Promise<CommunityNotesResponse> {
        const response = await apiClient.get<ApiResponse<CommunityNotesResponse>>(
            `/api/community-notes/user/${userId}`,
            {
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                },
            }
        );
        return response.data.data!;
    },

    /**
     * Get current user's notes
     * GET /api/community-notes/me
     */
    async getMyNotes(params?: { page?: number; limit?: number }): Promise<CommunityNotesResponse> {
        const response = await apiClient.get<ApiResponse<CommunityNotesResponse>>('/api/community-notes/me', {
            params: {
                page: params?.page || 1,
                limit: params?.limit || 10,
            },
        });
        return response.data.data!;
    },

    /**
     * Get a specific community note by ID
     * GET /api/community-notes/{id}
     */
    async getNoteById(id: string): Promise<CommunityNote> {
        const response = await apiClient.get<ApiResponse<CommunityNote>>(`/api/community-notes/${id}`);
        return response.data.data!;
    },

    /**
     * Update a community note
     * PUT /api/community-notes/{id}
     */
    async updateNote(id: string, data: UpdateNoteRequest): Promise<CommunityNote> {
        const response = await apiClient.put<ApiResponse<CommunityNote>>(`/api/community-notes/${id}`, data);
        return response.data.data!;
    },

    /**
     * Delete a community note
     * DELETE /api/community-notes/{id}
     */
    async deleteNote(id: string): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.delete<ApiResponse>(`/api/community-notes/${id}`);
        return {
            success: response.data.success,
            message: response.data.message || 'Note deleted successfully',
        };
    },

    /**
     * Toggle pin status of a note (Rep/Admin only)
     * PATCH /api/community-notes/{id}/pin
     */
    async togglePin(id: string, data: PinNoteRequest): Promise<CommunityNote> {
        const response = await apiClient.patch<ApiResponse<CommunityNote>>(`/api/community-notes/${id}/pin`, data);
        return response.data.data!;
    },

    /**
     * Report a community note for review
     * POST /api/community-notes/{id}/report
     */
    async reportNote(id: string): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.post<ApiResponse>(`/api/community-notes/${id}/report`);
        return {
            success: response.data.success,
            message: response.data.message || 'Note reported successfully',
        };
    },
};
