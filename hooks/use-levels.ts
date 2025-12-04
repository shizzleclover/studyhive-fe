import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { levelsService } from '@/lib/api/services/levels.service';
import { CreateLevelRequest, UpdateLevelRequest, LevelsParams, Level } from '@/lib/api/types';
import { toast } from 'sonner';

// Query keys
export const levelsKeys = {
    all: ['levels'] as const,
    lists: (params?: LevelsParams) => [...levelsKeys.all, 'list', params ?? {}] as const,
    detail: (id: string) => [...levelsKeys.all, 'detail', id] as const,
};

/**
 * Get all levels (optionally filtered)
 */
export function useLevels(params?: LevelsParams) {
    return useQuery({
        queryKey: levelsKeys.lists(params),
        queryFn: () => levelsService.getAllLevels(params),
    });
}

/**
 * Get a single level by ID
 */
export function useLevel(id: string) {
    return useQuery({
        queryKey: levelsKeys.detail(id),
        queryFn: () => levelsService.getLevelById(id),
        enabled: !!id,
    });
}

/**
 * Create a new level (admin only)
 */
export function useCreateLevel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLevelRequest) => levelsService.createLevel(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: levelsKeys.lists() });
            toast.success('Level created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create level');
        },
    });
}

/**
 * Update a level (admin only)
 */
export function useUpdateLevel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateLevelRequest }) =>
            levelsService.updateLevel(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: levelsKeys.lists() });
            toast.success('Level updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update level');
        },
    });
}

/**
 * Delete a level (admin only)
 */
export function useDeleteLevel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => levelsService.deleteLevel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: levelsKeys.lists() });
            toast.success('Level deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete level');
        },
    });
}
