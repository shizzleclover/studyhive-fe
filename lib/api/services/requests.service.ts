import { apiClient } from '../client';
import {
    ApiResponse,
    PaginatedResponse,
    StudyRequest,
    RequestFilters,
    CreateRequestPayload,
} from '../types';

export const requestsService = {
    /**
     * List study requests with filters
     * GET /api/requests
     */
    async getRequests(params?: RequestFilters): Promise<PaginatedResponse<StudyRequest>> {
        const response = await apiClient.get<ApiResponse<PaginatedResponse<StudyRequest>>>('/api/requests', {
            params,
        });
        return response.data.data!;
    },

    /**
     * Create a new request
     * POST /api/requests
     */
    async createRequest(data: CreateRequestPayload): Promise<StudyRequest> {
        const response = await apiClient.post<ApiResponse<StudyRequest>>('/api/requests', data);
        return response.data.data!;
    },

    /**
     * Fulfill a request (Rep/Admin)
     * PATCH /api/requests/{id}/fulfill
     */
    async fulfillRequest(id: string, payload?: Record<string, any>) {
        const response = await apiClient.patch<ApiResponse<StudyRequest>>(`/api/requests/${id}/fulfill`, payload);
        return response.data.data!;
    },

    /**
     * Reject a request
     * PATCH /api/requests/{id}/reject
     */
    async rejectRequest(id: string, payload?: Record<string, any>) {
        const response = await apiClient.patch<ApiResponse<StudyRequest>>(`/api/requests/${id}/reject`, payload);
        return response.data.data!;
    },
};


