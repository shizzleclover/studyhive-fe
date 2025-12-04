import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { coursesService } from '@/lib/api/services/courses.service';
import { CoursesParams, CreateCourseRequest, UpdateCourseRequest } from '@/lib/api/types';
import { toast } from 'sonner';

// Query keys
export const coursesKeys = {
    all: ['courses'] as const,
    lists: () => [...coursesKeys.all, 'list'] as const,
    list: (params: CoursesParams) => [...coursesKeys.lists(), params] as const,
    details: () => [...coursesKeys.all, 'detail'] as const,
    detail: (id: string) => [...coursesKeys.details(), id] as const,
};

/**
 * Get all courses with optional filters
 */
export function useCourses(params?: CoursesParams) {
    return useQuery({
        queryKey: coursesKeys.list(params || {}),
        queryFn: () => coursesService.getAllCourses(params),
    });
}

/**
 * Get a specific course
 */
export function useCourse(id: string) {
    return useQuery({
        queryKey: coursesKeys.detail(id),
        queryFn: () => coursesService.getCourseById(id),
        enabled: !!id,
    });
}

/**
 * Create a new course (admin only)
 */
export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCourseRequest) => coursesService.createCourse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: coursesKeys.lists() });
            toast.success('Course created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create course');
        },
    });
}

/**
 * Update a course (admin only)
 */
export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCourseRequest }) =>
            coursesService.updateCourse(id, data),
        onSuccess: (updatedCourse) => {
            queryClient.invalidateQueries({ queryKey: coursesKeys.detail(updatedCourse._id) });
            queryClient.invalidateQueries({ queryKey: coursesKeys.lists() });
            toast.success('Course updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update course');
        },
    });
}

/**
 * Delete a course (admin only)
 */
export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => coursesService.deleteCourse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: coursesKeys.lists() });
            toast.success('Course deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete course');
        },
    });
}
