import { apiClient } from '../client';
import {
    ApiResponse,
    Level,
    CreateLevelRequest,
    UpdateLevelRequest,
    LevelsListResponse,
    LevelsParams,
} from '../types';

export const levelsService = {
    /**
     * Get all levels
     * GET /api/levels
     */
    async getAllLevels(params?: LevelsParams): Promise<LevelsListResponse> {
        const response = await apiClient.get<ApiResponse<LevelsListResponse>>('/api/levels', {
            params: {
                isActive: params?.isActive,
            },
        });
        return response.data.data!;
    },

    /**
     * Get level by ID
     * GET /api/levels/{id}
     */
    async getLevelById(id: string): Promise<Level> {
        const response = await apiClient.get<ApiResponse<{ level: Level }>>(`/api/levels/${id}`);
        return response.data.data!.level;
    },

    /**
     * Get level by code
     * GET /api/levels/code/{code}
     */
    async getLevelByCode(code: string): Promise<Level> {
        const response = await apiClient.get<ApiResponse<{ level: Level }>>(`/api/levels/code/${code}`);
        return response.data.data!.level;
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
     * PUT /api/levels/{id}
     */
    async updateLevel(id: string, data: UpdateLevelRequest): Promise<Level> {
        const response = await apiClient.put<ApiResponse<Level>>(`/api/levels/${id}`, data);
        return response.data.data!;
    },

    /**
     * Toggle level status (admin only)
     * PATCH /api/levels/{id}/status
     */
    async toggleLevelStatus(id: string, isActive: boolean): Promise<Level> {
        const response = await apiClient.patch<ApiResponse<Level>>(`/api/levels/${id}/status`, {
            isActive,
        });
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
