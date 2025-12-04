"use client";

import { useState } from "react";
import { useLevels, useCreateLevel, useUpdateLevel, useDeleteLevel } from "@/hooks/use-levels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LevelsTestPage() {
    const { user } = useAuth();
    const { data: levels, isLoading } = useLevels();
    const createLevel = useCreateLevel();
    const updateLevel = useUpdateLevel();
    const deleteLevel = useDeleteLevel();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        department: '',
        faculty: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createLevel.mutate(formData, {
            onSuccess: () => {
                setFormData({ name: '', description: '', department: '', faculty: '' });
                setShowCreateForm(false);
            },
        });
    };

    const handleUpdate = (id: string) => {
        updateLevel.mutate(
            { id, data: formData },
            {
                onSuccess: () => {
                    setFormData({ name: '', description: '', department: '', faculty: '' });
                    setEditingId(null);
                },
            }
        );
    };

    const startEdit = (level: any) => {
        setEditingId(level._id);
        setFormData({
            name: level.name,
            description: level.description || '',
            department: level.department || '',
            faculty: level.faculty || '',
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const isAdmin = user?.role === 'admin';

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Academic Levels</h1>
                    <p className="text-muted-foreground">{levels?.length || 0} levels configured</p>
                </div>
                {isAdmin && (
                    <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Level
                    </Button>
                )}
            </div>

            {showCreateForm && isAdmin && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Level</CardTitle>
                        <CardDescription>Add a new academic level to the system</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Level Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., 100 Level, 200 Level"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Optional description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        placeholder="e.g., Computer Science"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="faculty">Faculty</Label>
                                    <Input
                                        id="faculty"
                                        placeholder="e.g., Science"
                                        value={formData.faculty}
                                        onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={createLevel.isPending}>
                                    {createLevel.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Create Level
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {levels?.map((level) => (
                    <Card key={level._id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle>{level.name}</CardTitle>
                                    {level.description && (
                                        <CardDescription className="mt-1">{level.description}</CardDescription>
                                    )}
                                </div>
                                {isAdmin && (
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => startEdit(level)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                if (confirm('Delete this level?')) {
                                                    deleteLevel.mutate(level._id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm space-y-1">
                                {level.department && (
                                    <div>
                                        <span className="font-medium">Department:</span> {level.department}
                                    </div>
                                )}
                                {level.faculty && (
                                    <div>
                                        <span className="font-medium">Faculty:</span> {level.faculty}
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium">Status:</span>{' '}
                                    <span className={level.isActive ? 'text-green-600' : 'text-red-600'}>
                                        {level.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {editingId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Edit Level</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="edit-name">Level Name</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => handleUpdate(editingId)} disabled={updateLevel.isPending}>
                                    {updateLevel.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Update
                                </Button>
                                <Button variant="outline" onClick={() => setEditingId(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
