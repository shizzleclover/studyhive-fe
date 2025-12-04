"use client";

import { useState } from "react";
import {
    useCourses,
    useCourse,
    useCreateCourse,
    useUpdateCourse,
    useDeleteCourse,
} from "@/hooks/use-courses";
import { useLevels } from "@/hooks/use-levels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CoursesTestPage() {
    const { user } = useAuth();
    const { data: levels } = useLevels();

    const [filters, setFilters] = useState({
        levelId: '',
        semester: '',
        search: '',
    });

    const { data: courses, isLoading } = useCourses(filters);
    const createCourse = useCreateCourse();
    const deleteCourse = useDeleteCourse();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        description: '',
        level: '',
        department: '',
        creditUnits: 3,
        semester: 'First',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createCourse.mutate(formData, {
            onSuccess: () => {
                setFormData({
                    title: '',
                    code: '',
                    description: '',
                    level: '',
                    department: '',
                    creditUnits: 3,
                    semester: 'First',
                });
                setShowCreateForm(false);
            },
        });
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Course Catalog</h1>
                    <p className="text-muted-foreground">{courses?.length || 0} courses available</p>
                </div>
                {isAdmin && (
                    <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Course
                    </Button>
                )}
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <Label>Level</Label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={filters.levelId}
                                onChange={(e) => setFilters({ ...filters, levelId: e.target.value })}
                            >
                                <option value="">All Levels</option>
                                {levels?.map((level) => (
                                    <option key={level._id} value={level._id}>
                                        {level.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>Semester</Label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={filters.semester}
                                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                            >
                                <option value="">All Semesters</option>
                                <option value="First">First</option>
                                <option value="Second">Second</option>
                            </select>
                        </div>
                        <div>
                            <Label>Search</Label>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search courses..."
                                    className="pl-8"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Create Form */}
            {showCreateForm && isAdmin && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Course</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="title">Course Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Introduction to Programming"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="code">Course Code *</Label>
                                    <Input
                                        id="code"
                                        placeholder="e.g., CSC101"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Course description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows={3}
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="level">Level *</Label>
                                    <select
                                        id="level"
                                        className="w-full p-2 border rounded-md"
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Level</option>
                                        {levels?.map((level) => (
                                            <option key={level._id} value={level._id}>
                                                {level.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="semester">Semester *</Label>
                                    <select
                                        id="semester"
                                        className="w-full p-2 border rounded-md"
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                        required
                                    >
                                        <option value="First">First</option>
                                        <option value="Second">Second</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="creditUnits">Credit Units *</Label>
                                    <Input
                                        id="creditUnits"
                                        type="number"
                                        min="1"
                                        max="6"
                                        value={formData.creditUnits}
                                        onChange={(e) => setFormData({ ...formData, creditUnits: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="department">Department *</Label>
                                <Input
                                    id="department"
                                    placeholder="e.g., Computer Science"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={createCourse.isPending}>
                                    {createCourse.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Create Course
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Courses List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : courses && courses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => (
                        <Card key={course._id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{course.code}</CardTitle>
                                        <CardDescription className="mt-1">{course.title}</CardDescription>
                                    </div>
                                    {isAdmin && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                if (confirm('Delete this course?')) {
                                                    deleteCourse.mutate(course._id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-2">
                                    <p className="text-muted-foreground line-clamp-2">{course.description}</p>
                                    <div className="space-y-1">
                                        <div>
                                            <span className="font-medium">Department:</span> {course.department}
                                        </div>
                                        <div>
                                            <span className="font-medium">Semester:</span> {course.semester}
                                        </div>
                                        <div>
                                            <span className="font-medium">Credit Units:</span> {course.creditUnits}
                                        </div>
                                        <div>
                                            <span className="font-medium">Status:</span>{' '}
                                            <span className={course.isActive ? 'text-green-600' : 'text-red-600'}>
                                                {course.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No courses found. {isAdmin && 'Create one to get started!'}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
