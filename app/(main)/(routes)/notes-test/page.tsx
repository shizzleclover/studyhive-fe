"use client";

import { useState } from "react";
import { useCommunityNotes, useCreateNote } from "@/hooks/use-community-notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";

export default function CommunityNotesTestPage() {
    const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Fetch notes
    const { data, isLoading, error } = useCommunityNotes({
        page: 1,
        limit: 10,
        sortBy
    });

    // Create note mutation
    const createNote = useCreateNote();

    // Form state
    const [formData, setFormData] = useState({
        courseId: '',
        title: '',
        content: ''
    });

    const handleCreateNote = (e: React.FormEvent) => {
        e.preventDefault();
        createNote.mutate(formData, {
            onSuccess: () => {
                setFormData({ courseId: '', title: '', content: '' });
                setShowCreateForm(false);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded">
                    Error loading notes: {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Community Notes</h1>
                    <p className="text-muted-foreground">
                        {data?.pagination.totalItems || 0} notes available
                    </p>
                </div>
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Note
                </Button>
            </div>

            {/* Sort Toggle */}
            <div className="flex gap-2">
                <Button
                    variant={sortBy === 'recent' ? 'default' : 'outline'}
                    onClick={() => setSortBy('recent')}
                >
                    Recent
                </Button>
                <Button
                    variant={sortBy === 'popular' ? 'default' : 'outline'}
                    onClick={() => setSortBy('popular')}
                >
                    Popular
                </Button>
            </div>

            {/* Create Form */}
            {showCreateForm && (
                <div className="bg-card border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Create New Note</h2>
                    <form onSubmit={handleCreateNote} className="space-y-4">
                        <div>
                            <Label htmlFor="courseId">Course ID</Label>
                            <Input
                                id="courseId"
                                placeholder="Enter course ID"
                                value={formData.courseId}
                                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Note title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Note content..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                                rows={5}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={createNote.isPending}>
                                {createNote.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Create Note
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Notes List */}
            <div className="space-y-4">
                {data?.data.map((note) => (
                    <div key={note._id} className="bg-card border rounded-lg p-6">
                        {note.isPinned && (
                            <div className="text-xs font-medium text-amber-500 mb-2">📌 PINNED</div>
                        )}
                        <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                        <p className="text-muted-foreground mb-4">{note.content}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>By: {note.authorId.name}</span>
                            <span>•</span>
                            <span>Course: {note.courseId.code}</span>
                            <span>•</span>
                            <span>👍 {note.upvotes}</span>
                            <span>👎 {note.downvotes}</span>
                            <span>💾 {note.saves}</span>
                            <span>💬 {note.commentCount}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {data?.pagination && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page {data.pagination.currentPage} of {data.pagination.totalPages}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            disabled={!data.pagination.hasPrevPage}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            disabled={!data.pagination.hasNextPage}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
