import { apiClient } from '../client';
import {
    ApiResponse,
    Comment,
    CreateCommentPayload,
    UpdateCommentPayload,
    PaginatedResponse,
} from '../types';

export const commentsService = {
    /**
     * List comments for parent
     */
    async getComments(parentId: string, parentType: CreateCommentPayload['parentType']): Promise<PaginatedResponse<Comment>> {
        const response = await apiClient.get<ApiResponse<PaginatedResponse<Comment>>>('/api/comments', {
            params: { parentId, parentType },
        });
        return response.data.data!;
    },

    /**
     * Create comment
     */
    async createComment(payload: CreateCommentPayload): Promise<Comment> {
        const response = await apiClient.post<ApiResponse<Comment>>('/api/comments', payload);
        return response.data.data!;
    },

    /**
     * Update comment
     */
    async updateComment(id: string, payload: UpdateCommentPayload): Promise<Comment> {
        const response = await apiClient.patch<ApiResponse<Comment>>(`/api/comments/${id}`, payload);
        return response.data.data!;
    },

    /**
     * Delete comment
     */
    async deleteComment(id: string) {
        await apiClient.delete(`/api/comments/${id}`);
        return { success: true };
    },
};


