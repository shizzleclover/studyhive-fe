import { apiClient } from '../client';
import { ApiResponse } from '../types';

export interface PresignedUrlRequest {
    fileName: string;
    fileType: string;
    folder?: 'notes' | 'past-questions' | 'official-notes' | 'quizzes' | 'profiles';
}

export interface PresignedUrlResponse {
    uploadUrl: string;
    fileKey: string;
    downloadUrl: string;
}

export const uploadService = {
    /**
     * Request presigned URL for direct R2 upload
     * POST /api/upload/presigned-url
     */
    async getPresignedUrl(data: PresignedUrlRequest): Promise<PresignedUrlResponse> {
        const response = await apiClient.post<ApiResponse<PresignedUrlResponse>>(
            '/api/upload/presigned-url',
            data
        );
        return response.data.data!;
    },

    /**
     * Upload file directly to R2 using presigned URL
     * @param uploadUrl - Presigned URL from getPresignedUrl
     * @param file - File object to upload
     * @param onProgress - Optional progress callback (0-100)
     */
    async uploadToR2(
        uploadUrl: string,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(Math.round(percentComplete));
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    resolve();
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });

            xhr.addEventListener('abort', () => {
                reject(new Error('Upload cancelled'));
            });

            xhr.open('PUT', uploadUrl);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.send(file);
        });
    },

    /**
     * Complete two-step upload process
     * 1. Get presigned URL
     * 2. Upload to R2
     * @returns fileKey and downloadUrl for use in module endpoints
     */
    async uploadFile(
        file: File,
        folder?: PresignedUrlRequest['folder'],
        onProgress?: (progress: number) => void
    ): Promise<{ fileKey: string; downloadUrl: string }> {
        // Step 1: Get presigned URL
        const { uploadUrl, fileKey, downloadUrl } = await this.getPresignedUrl({
            fileName: file.name,
            fileType: file.type,
            folder,
        });

        // Step 2: Upload to R2
        await this.uploadToR2(uploadUrl, file, onProgress);

        // Return metadata for module endpoints
        return { fileKey, downloadUrl };
    },
};
