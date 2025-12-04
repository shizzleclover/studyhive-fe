"use client";

import { useState } from "react";
import { UploadManager } from "@/components/upload-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadTestPage() {
    const [uploadedFiles, setUploadedFiles] = useState<Array<{ fileKey: string; downloadUrl: string; timestamp: number }>>([]);

    const handleUploadComplete = (fileData: { fileKey: string; downloadUrl: string }) => {
        setUploadedFiles(prev => [...prev, { ...fileData, timestamp: Date.now() }]);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Upload Service Test</h1>
                <p className="text-muted-foreground">Test the two-step upload flow (presigned URL → R2 upload)</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Test different folders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notes Upload</CardTitle>
                        <CardDescription>Test upload to notes folder</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UploadManager
                            folder="notes"
                            onUploadComplete={handleUploadComplete}
                            acceptedFileTypes=".pdf,.doc,.docx,.txt"
                            maxSizeMB={5}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Past Questions Upload</CardTitle>
                        <CardDescription>Test upload to past-questions folder</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UploadManager
                            folder="past-questions"
                            onUploadComplete={handleUploadComplete}
                            acceptedFileTypes=".pdf"
                            maxSizeMB={10}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Profile Picture Upload</CardTitle>
                        <CardDescription>Test upload to profiles folder</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UploadManager
                            folder="profiles"
                            onUploadComplete={handleUploadComplete}
                            acceptedFileTypes="image/*"
                            maxSizeMB={2}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quiz Media Upload</CardTitle>
                        <CardDescription>Test upload to quizzes folder</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UploadManager
                            folder="quizzes"
                            onUploadComplete={handleUploadComplete}
                            acceptedFileTypes="image/*,.pdf"
                            maxSizeMB={5}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Upload History */}
            {uploadedFiles.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upload History</CardTitle>
                        <CardDescription>{uploadedFiles.length} files uploaded successfully</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="p-3 border rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-sm">Upload #{index + 1}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(file.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <div className="truncate">
                                            <span className="font-medium">File Key:</span> {file.fileKey}
                                        </div>
                                        <div className="truncate">
                                            <span className="font-medium">Download URL:</span>{' '}
                                            <a
                                                href={file.downloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                {file.downloadUrl}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>Testing Instructions</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                    <ol>
                        <li>Select a file using one of the upload managers above</li>
                        <li>Click &quot;Upload File&quot; to start the two-step upload process</li>
                        <li>Watch the progress bar as the file uploads to R2</li>
                        <li>Once complete, the fileKey and downloadUrl will appear</li>
                        <li>These can be used in module endpoints (notes, past questions, etc.)</li>
                        <li>Upload history shows all successful uploads in this session</li>
                    </ol>

                    <h4>What&apos;s Tested:</h4>
                    <ul>
                        <li>Presigned URL request (POST /api/upload/presigned-url)</li>
                        <li>Direct R2 upload via PUT with progress tracking</li>
                        <li>File size validation</li>
                        <li>File type filtering</li>
                        <li>Folder-specific uploads</li>
                        <li>Upload cancellation</li>
                        <li>Error handling</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
