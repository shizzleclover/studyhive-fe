import { apiClient } from '../client';
import {
    ApiResponse,
    GlobalSearchResult,
    SearchParams,
} from '../types';

export const searchService = {
    /**
     * Global search endpoint
     */
    async globalSearch(params: SearchParams): Promise<GlobalSearchResult> {
        const response = await apiClient.get<ApiResponse<GlobalSearchResult>>('/api/search', {
            params,
        });
        return response.data.data!;
    },

    /**
     * Suggestions endpoint with debounce
     */
    async getSuggestions(query: string, type?: SearchParams['type']) {
        const response = await apiClient.get<ApiResponse<any>>('/api/search/suggestions', {
            params: { q: query, type },
        });
        return response.data.data!;
    },
};


