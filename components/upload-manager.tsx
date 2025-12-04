"use client";

import { useState, useRef } from "react";
import { useFileUpload } from "@/hooks/use-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { X, Upload, FileIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadManagerProps {
    onUploadComplete?: (fileData: { fileKey: string; downloadUrl: string }) => void;
    folder?: 'notes' | 'past-questions' | 'official-notes' | 'quizzes' | 'profiles';
    acceptedFileTypes?: string;
    maxSizeMB?: number;
    disabled?: boolean;
}

export function UploadManager({
    onUploadComplete,
    folder,
    acceptedFileTypes = "*/*",
    maxSizeMB = 10,
    disabled = false,
}: UploadManagerProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedData, setUploadedData] = useState<{ fileKey: string; downloadUrl: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate: uploadFile, uploadProgress, isPending } = useFileUpload();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            alert(`File size must be less than ${maxSizeMB}MB`);
            return;
        }

        setSelectedFile(file);
        setUploadedData(null);
    };

    const handleUpload = () => {
        if (!selectedFile) return;

        uploadFile(
            { file: selectedFile, folder },
            {
                onSuccess: (data) => {
                    setUploadedData(data);
                    onUploadComplete?.(data);
                },
            }
        );
    };

    const handleClear = () => {
        setSelectedFile(null);
        setUploadedData(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="file-upload">Select File</Label>
                <div className="flex gap-2">
                    <Input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        accept={acceptedFileTypes}
                        onChange={handleFileSelect}
                        disabled={disabled || isPending}
                        className="cursor-pointer"
                    />
                    {selectedFile && !uploadedData && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleClear}
                            disabled={isPending}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    Max size: {maxSizeMB}MB
                </p>
            </div>

            {selectedFile && !uploadedData && (
                <div className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                        <FileIcon className="h-8 w-8 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    </div>

                    {uploadProgress.isUploading && (
                        <div className="space-y-2">
                            <Progress value={uploadProgress.progress} className="h-2" />
                            <p className="text-xs text-center text-muted-foreground">
                                Uploading... {uploadProgress.progress}%
                            </p>
                        </div>
                    )}

                    <Button
                        onClick={handleUpload}
                        disabled={isPending}
                        className="w-full"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload File
                            </>
                        )}
                    </Button>
                </div>
            )}

            {uploadedData && (
                <div className="p-4 border border-green-500/20 bg-green-500/10 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                            <p className="font-medium text-green-700 dark:text-green-400">Upload Complete</p>
                            <p className="text-sm text-muted-foreground truncate">
                                File Key: {uploadedData.fileKey}
                            </p>
                            <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs"
                                onClick={handleClear}
                            >
                                Upload another file
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
