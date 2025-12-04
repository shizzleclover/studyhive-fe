import { apiClient } from '../client';
import {
    ApiResponse,
    Course,
    CoursesParams,
    CreateCourseRequest,
    UpdateCourseRequest,
} from '../types';

export const coursesService = {
    /**
     * Get all courses with optional filters
     * GET /api/courses
     */
    async getAllCourses(params?: CoursesParams): Promise<Course[]> {
        const response = await apiClient.get<ApiResponse<Course[]>>('/api/courses', {
            params: {
                levelId: params?.levelId,
                semester: params?.semester,
                search: params?.search,
                page: params?.page,
                limit: params?.limit,
            },
        });
        return response.data.data!;
    },

    /**
     * Get a specific course
     * GET /api/courses/{id}
     */
    async getCourseById(id: string): Promise<Course> {
        const response = await apiClient.get<ApiResponse<Course>>(`/api/courses/${id}`);
        return response.data.data!;
    },

    /**
     * Create a new course (admin only)
     * POST /api/courses
     */
    async createCourse(data: CreateCourseRequest): Promise<Course> {
        const response = await apiClient.post<ApiResponse<Course>>('/api/courses', data);
        return response.data.data!;
    },

    /**
     * Update a course (admin only)
     * PATCH /api/courses/{id}
     */
    async updateCourse(id: string, data: UpdateCourseRequest): Promise<Course> {
        const response = await apiClient.patch<ApiResponse<Course>>(`/api/courses/${id}`, data);
        return response.data.data!;
    },

    /**
     * Delete a course (admin only)
     * DELETE /api/courses/{id}
     */
    async deleteCourse(id: string): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.delete<ApiResponse>(`/api/courses/${id}`);
        return {
            success: response.data.success,
            message: response.data.message || 'Course deleted successfully',
        };
    },
};
