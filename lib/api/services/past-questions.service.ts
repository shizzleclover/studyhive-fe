import { apiClient } from '../client';
import {
    ApiResponse,
    PaginatedResponse,
    PastQuestion,
    PastQuestionFilters,
} from '../types';

export const pastQuestionsService = {
    /**
     * List past questions with filters
     * GET /api/past-questions
     */
    async getPastQuestions(params?: PastQuestionFilters): Promise<PaginatedResponse<PastQuestion>> {
        const response = await apiClient.get<ApiResponse<PaginatedResponse<PastQuestion>>>('/api/past-questions', {
            params,
        });
        return response.data.data!;
    },

    /**
     * Get past questions for a specific course
     * GET /api/past-questions?courseId=...
     */
    async getByCourse(courseId: string, params?: Omit<PastQuestionFilters, 'courseId'>) {
        return this.getPastQuestions({ ...params, courseId });
    },

    /**
     * Get a single past question
     * GET /api/past-questions/{id}
     */
    async getPastQuestion(id: string): Promise<PastQuestion> {
        const response = await apiClient.get<ApiResponse<PastQuestion>>(`/api/past-questions/${id}`);
        return response.data.data!;
    },

    /**
     * Create a new past question (Rep/Admin)
     * POST /api/past-questions
     */
    async createPastQuestion(data: Partial<PastQuestion>) {
        const response = await apiClient.post<ApiResponse<PastQuestion>>('/api/past-questions', data);
        return response.data.data!;
    },

    /**
     * Download past question - server returns signed URL
     * GET /api/past-questions/{id}/download
     */
    async downloadPastQuestion(id: string) {
        const response = await apiClient.get<ApiResponse<{ downloadUrl: string }>>(
            `/api/past-questions/${id}/download`
        );
        return response.data.data!;
    },
};


