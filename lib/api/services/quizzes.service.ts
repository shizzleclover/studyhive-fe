import { apiClient } from '../client';
import {
    ApiResponse,
    PaginatedResponse,
    Quiz,
    QuizFilters,
    QuizAttemptRequest,
    QuizAttemptResult,
} from '../types';

export const quizzesService = {
    /**
     * List quizzes with filters
     */
    async getQuizzes(params?: QuizFilters): Promise<PaginatedResponse<Quiz>> {
        const response = await apiClient.get<ApiResponse<PaginatedResponse<Quiz>>>('/api/quizzes', {
            params,
        });
        return response.data.data!;
    },

    /**
     * Get quizzes for a course
     */
    async getQuizzesByCourse(courseId: string, params?: Omit<QuizFilters, 'courseId'>) {
        return this.getQuizzes({ ...params, courseId });
    },

    /**
     * Get quiz detail
     */
    async getQuizById(id: string, includeQuestions = true): Promise<Quiz> {
        const response = await apiClient.get<ApiResponse<Quiz>>(`/api/quizzes/${id}`, {
            params: { attempting: includeQuestions },
        });
        return response.data.data!;
    },

    /**
     * Submit quiz attempt
     */
    async submitQuizAttempt(id: string, payload: QuizAttemptRequest): Promise<QuizAttemptResult> {
        const response = await apiClient.post<ApiResponse<QuizAttemptResult>>(
            `/api/quizzes/${id}/attempt`,
            payload
        );
        return response.data.data!;
    },
};


