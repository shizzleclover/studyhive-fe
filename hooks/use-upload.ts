import { useMutation } from '@tanstack/react-query';
import { uploadService, PresignedUrlRequest } from '@/lib/api/services/upload.service';
import { toast } from 'sonner';
import { useState } from 'react';

interface UploadProgress {
    progress: number;
    isUploading: boolean;
}

/**
 * Hook for file upload with progress tracking
 */
export function useFileUpload() {
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
        progress: 0,
        isUploading: false,
    });

    const mutation = useMutation({
        mutationFn: async ({
            file,
            folder,
        }: {
            file: File;
            folder?: PresignedUrlRequest['folder'];
        }) => {
            setUploadProgress({ progress: 0, isUploading: true });

            const result = await uploadService.uploadFile(file, folder, (progress) => {
                setUploadProgress({ progress, isUploading: true });
            });

            setUploadProgress({ progress: 100, isUploading: false });
            return result;
        },
        onSuccess: () => {
            toast.success('File uploaded successfully');
        },
        onError: (error: any) => {
            setUploadProgress({ progress: 0, isUploading: false });
            toast.error(error.message || 'Failed to upload file');
        },
    });

    return {
        ...mutation,
        uploadProgress,
    };
}

/**
 * Hook for getting presigned URL only (manual upload)
 */
export function usePresignedUrl() {
    return useMutation({
        mutationFn: (data: PresignedUrlRequest) => uploadService.getPresignedUrl(data),
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to get upload URL');
        },
    });
}
