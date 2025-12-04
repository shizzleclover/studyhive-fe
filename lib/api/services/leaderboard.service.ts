import { apiClient } from '../client';
import {
    ApiResponse,
    LeaderboardEntry,
    LeaderboardFilters,
} from '../types';

export const leaderboardService = {
    /**
     * Global leaderboard
     */
    async getLeaderboard(params?: LeaderboardFilters): Promise<LeaderboardEntry[]> {
        const response = await apiClient.get<ApiResponse<LeaderboardEntry[]>>('/api/leaderboard', {
            params,
        });
        return response.data.data!;
    },

    /**
     * Current user rank
     */
    async getMyRank() {
        const response = await apiClient.get<ApiResponse<LeaderboardEntry>>('/api/leaderboard/me');
        return response.data.data!;
    },

    /**
     * Top contributors widget
     */
    async getTopContributors(limit = 5) {
        const response = await apiClient.get<ApiResponse<LeaderboardEntry[]>>('/api/leaderboard/top-contributors', {
            params: { limit },
        });
        return response.data.data!;
    },
};


