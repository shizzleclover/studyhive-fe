import { apiClient } from '../client';
import {
    ApiResponse,
    VotePayload,
} from '../types';

export const votesService = {
    async castVote(payload: VotePayload) {
        const response = await apiClient.post<ApiResponse>(`/api/votes`, payload);
        return response.data;
    },
    async removeVote(voteId: string) {
        await apiClient.delete(`/api/votes/${voteId}`);
        return { success: true };
    },
};


