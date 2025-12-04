"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLevels, useCreateLevel, useUpdateLevel } from "@/hooks/use-levels";
import { useCourses } from "@/hooks/use-courses";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Layers, Plus, BookOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const AcademicAdminPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const { data: levelsData, isLoading: levelsLoading } = useLevels();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { mutateAsync: createLevel, isPending: creatingLevel } = useCreateLevel();
  const { mutateAsync: updateLevel, isPending: updatingLevel } = useUpdateLevel();

  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelCode, setNewLevelCode] = useState("");

  if (!user || user.role !== "admin") {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold mb-2">Admin access required</h1>
          <p className="text-sm text-muted-foreground">
            You need an administrator account to configure academic structure.
          </p>
        </div>
      </div>
    );
  }

  const levels = Array.isArray(levelsData?.levels) ? levelsData!.levels : [];

  const handleCreateLevel = async () => {
    if (!newLevelName.trim() || !newLevelCode.trim()) return;
    await createLevel({ name: newLevelName.trim(), code: newLevelCode.trim(), description: "", order: levels.length + 1 });
    setNewLevelName("");
    setNewLevelCode("");
  };

  const toggleLevelStatus = async (levelId: string, isActive: boolean) => {
    await updateLevel({ id: levelId, data: { isActive: !isActive } });
  };

  return (
    <div className="h-full p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Admin
          </button>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">Academic Setup</span>
          </div>
        </div>

        <div className="grid md:grid-cols-[1.1fr,1.4fr] gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Levels</h2>
                <p className="text-xs text-muted-foreground">
                  Create and toggle levels (e.g. 100L, 200L, 400L).
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {levelsLoading ? (
                <div className="py-4 text-xs text-muted-foreground">Loading levels...</div>
              ) : (
                levels.map((level) => (
                  <div
                    key={level._id}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md border border-transparent hover:border-muted transition-colors",
                      !level.isActive && "opacity-60"
                    )}
                  >
                    <div>
                      <div className="text-sm font-medium">{level.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {level.code} • {level.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingLevel}
                      onClick={() => toggleLevelStatus(level._id, level.isActive)}
                    >
                      {level.isActive ? "Disable" : "Enable"}
                    </Button>
                  </div>
                ))
              )}

              <div className="border-t pt-3 mt-3 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Plus className="h-3 w-3" />
                  <span>Add new level</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Name (e.g. 400 Level)"
                      value={newLevelName}
                      onChange={(e) => setNewLevelName(e.target.value)}
                    />
                    <Input
                      placeholder="Code (e.g. 400L)"
                      className="w-28"
                      value={newLevelCode}
                      onChange={(e) => setNewLevelCode(e.target.value)}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleCreateLevel}
                    disabled={creatingLevel || !newLevelName.trim() || !newLevelCode.trim()}
                    className="self-start"
                  >
                    Create Level
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Courses
                </h2>
                <p className="text-xs text-muted-foreground">
                  View existing courses. Detailed course editing can be added here later.
                </p>
              </div>
            </div>

            {coursesLoading ? (
              <div className="py-4 text-xs text-muted-foreground">Loading courses...</div>
            ) : !courses || courses.length === 0 ? (
              <div className="py-4 text-xs text-muted-foreground">
                No courses configured yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/70 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{course.title}</span>
                        <span className="text-[11px] text-muted-foreground">{course.code}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {typeof course.level === "string" ? "" : (course.level as any)?.name} •{" "}
                        {course.department}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AcademicAdminPage;


