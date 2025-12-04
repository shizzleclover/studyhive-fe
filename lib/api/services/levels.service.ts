import { apiClient } from '../client';
import {
    ApiResponse,
    Level,
    CreateLevelRequest,
    UpdateLevelRequest,
} from '../types';

export const levelsService = {
    /**
     * Get all levels
     * GET /api/levels
     */
    async getAllLevels(): Promise<Level[]> {
        const response = await apiClient.get<ApiResponse<Level[]>>('/api/levels');
        return response.data.data!;
    },

    /**
     * Create a new level (admin only)
     * POST /api/levels
     */
    async createLevel(data: CreateLevelRequest): Promise<Level> {
        const response = await apiClient.post<ApiResponse<Level>>('/api/levels', data);
        return response.data.data!;
    },

    /**
     * Update a level (admin only)
     * PATCH /api/levels/{id}
     */
    async updateLevel(id: string, data: UpdateLevelRequest): Promise<Level> {
        const response = await apiClient.patch<ApiResponse<Level>>(`/api/levels/${id}`, data);
        return response.data.data!;
    },

    /**
     * Delete a level (admin only)
     * DELETE /api/levels/{id}
     */
    async deleteLevel(id: string): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.delete<ApiResponse>(`/api/levels/${id}`);
        return {
            success: response.data.success,
            message: response.data.message || 'Level deleted successfully',
        };
    },
};
