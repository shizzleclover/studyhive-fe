import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { communityNotesService } from '@/lib/api/services/community-notes.service';
import {
    CommunityNotesParams,
    CreateNoteRequest,
    UpdateNoteRequest,
    PinNoteRequest,
} from '@/lib/api/types';
import { toast } from 'sonner';

// Query keys
export const communityNotesKeys = {
    all: ['community-notes'] as const,
    lists: () => [...communityNotesKeys.all, 'list'] as const,
    list: (params: CommunityNotesParams) => [...communityNotesKeys.lists(), params] as const,
    details: () => [...communityNotesKeys.all, 'detail'] as const,
    detail: (id: string) => [...communityNotesKeys.details(), id] as const,
    byCourse: (courseId: string, params?: CommunityNotesParams) =>
        [...communityNotesKeys.all, 'course', courseId, params] as const,
    byUser: (userId: string) => [...communityNotesKeys.all, 'user', userId] as const,
    myNotes: () => [...communityNotesKeys.all, 'my-notes'] as const,
};

/**
 * Get all community notes with pagination
 */
export function useCommunityNotes(params?: CommunityNotesParams) {
    return useQuery({
        queryKey: communityNotesKeys.list(params || {}),
        queryFn: () => communityNotesService.getAllNotes(params),
    });
}

/**
 * Get community notes with infinite scroll
 */
export function useInfiniteCommunityNotes(params?: Omit<CommunityNotesParams, 'page'>) {
    return useInfiniteQuery({
        queryKey: [...communityNotesKeys.lists(), 'infinite', params],
        queryFn: ({ pageParam = 1 }) =>
            communityNotesService.getAllNotes({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) =>
            lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
        initialPageParam: 1,
    });
}

/**
 * Get a specific community note
 */
export function useCommunityNote(id: string) {
    return useQuery({
        queryKey: communityNotesKeys.detail(id),
        queryFn: () => communityNotesService.getNoteById(id),
        enabled: !!id,
    });
}

/**
 * Get notes by course
 */
export function useNotesByCourse(courseId: string, params?: CommunityNotesParams) {
    return useQuery({
        queryKey: communityNotesKeys.byCourse(courseId, params),
        queryFn: () => communityNotesService.getNotesByCourse(courseId, params),
        enabled: !!courseId,
    });
}

/**
 * Get notes by user
 */
export function useNotesByUser(userId: string, params?: { page?: number; limit?: number }) {
    return useQuery({
        queryKey: communityNotesKeys.byUser(userId),
        queryFn: () => communityNotesService.getNotesByUser(userId, params),
        enabled: !!userId,
    });
}

/**
 * Get current user's notes
 */
export function useMyNotes(params?: { page?: number; limit?: number }) {
    return useQuery({
        queryKey: communityNotesKeys.myNotes(),
        queryFn: () => communityNotesService.getMyNotes(params),
    });
}

/**
 * Create a new note
 */
export function useCreateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateNoteRequest) => communityNotesService.createNote(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: communityNotesKeys.lists() });
            queryClient.invalidateQueries({ queryKey: communityNotesKeys.myNotes() });
            toast.success('Note created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create note');
        },
    });
}

/**
 * Update a note
 */
export function useUpdateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateNoteRequest }) =>
            communityNotesService.updateNote(id, data),
        onSuccess: (updatedNote) => {
            queryClient.invalidateQueries({ queryKey: communityNotesKeys.detail(updatedNote._id) });
            queryClient.invalidateQueries({ queryKey: communityNotesKeys.lists() });
            queryClient.invalidateQueries({ queryKey: communityNotesKeys.myNotes() });
            toast.success('Note updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update note');
        },
    });
}

/**
 * Delete a note
 */
export function useDeleteNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => communityNotesService.deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: communityNotesKeys.lists() });
            queryClient.invalidateQueries({ queryKey: communityNotesKeys.myNotes() });
            toast.success('Note deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete note');
        },
    });
}

/**
 * Toggle pin status (Rep/Admin only)
 */
export function useTogglePin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) =>
            communityNotesService.togglePin(id, { isPinned }),
        onSuccess: (updatedNote) => {
            queryClient.invalidateQueries({ queryKey: communityNotesKeys.detail(updatedNote._id) });
            queryClient.invalidateQueries({ queryKey: communityNotesKeys.lists() });
            toast.success(updatedNote.isPinned ? 'Note pinned' : 'Note unpinned');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update pin status');
        },
    });
}

/**
 * Report a note
 */
export function useReportNote() {
    return useMutation({
        mutationFn: (id: string) => communityNotesService.reportNote(id),
        onSuccess: () => {
            toast.success('Note reported successfully. Our team will review it.');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to report note');
        },
    });
}
