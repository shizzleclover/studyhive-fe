import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/api/services/user.service';
import {
    UpdateProfileRequest,
    UpdateRoleRequest,
    AssignCoursesRequest,
    UpdateReputationRequest,
} from '@/lib/api/types';
import { toast } from 'sonner';

// Query keys
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters: string) => [...userKeys.lists(), { filters }] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
    stats: (id: string) => [...userKeys.all, 'stats', id] as const,
    savedNotes: () => [...userKeys.all, 'saved-notes'] as const,
};

/**
 * Get user by ID
 */
export function useUser(id: string) {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => userService.getUserById(id),
        enabled: !!id,
    });
}

/**
 * Get user statistics
 */
export function useUserStats(id: string) {
    return useQuery({
        queryKey: userKeys.stats(id),
        queryFn: () => userService.getUserStats(id),
        enabled: !!id,
    });
}

/**
 * Get all users (admin only)
 */
export function useUsers() {
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: () => userService.getAllUsers(),
    });
}

/**
 * Get saved notes
 */
export function useSavedNotes() {
    return useQuery({
        queryKey: userKeys.savedNotes(),
        queryFn: () => userService.getSavedNotes(),
    });
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileRequest) => userService.updateProfile(data),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(updatedUser._id) });
            queryClient.invalidateQueries({ queryKey: ['auth'] });
            toast.success('Profile updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        },
    });
}

/**
 * Save a note
 */
export function useSaveNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (noteId: string) => userService.saveNote(noteId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.savedNotes() });
            toast.success('Note saved');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to save note');
        },
    });
}

/**
 * Unsave a note
 */
export function useUnsaveNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (noteId: string) => userService.unsaveNote(noteId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.savedNotes() });
            toast.success('Note removed from saved');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to unsave note');
        },
    });
}

/**
 * Update user role (admin only)
 */
export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) =>
            userService.updateUserRole(id, data),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(updatedUser._id) });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            toast.success('User role updated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update user role');
        },
    });
}

/**
 * Deactivate user (admin only)
 */
export function useDeactivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.deactivateUser(id),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(updatedUser._id) });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            toast.success('User deactivated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to deactivate user');
        },
    });
}

/**
 * Activate user (admin only)
 */
export function useActivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.activateUser(id),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(updatedUser._id) });
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            toast.success('User activated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to activate user');
        },
    });
}

/**
 * Assign courses to user (admin only)
 */
export function useAssignCourses() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: AssignCoursesRequest }) =>
            userService.assignCourses(id, data),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(updatedUser._id) });
            toast.success('Courses assigned successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to assign courses');
        },
    });
}

/**
 * Update user reputation (admin only)
 */
export function useUpdateReputation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateReputationRequest }) =>
            userService.updateReputation(id, data),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: userKeys.detail(updatedUser._id) });
            queryClient.invalidateQueries({ queryKey: userKeys.stats(updatedUser._id) });
            toast.success('Reputation updated');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update reputation');
        },
    });
}
