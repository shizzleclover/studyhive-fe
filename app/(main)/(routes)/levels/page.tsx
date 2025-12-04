"use client";

import { useRouter } from "next/navigation";
import { IconRenderer } from "@/components/icon-renderer";
import { useLevels } from "@/hooks/use-levels";
import { useCourses } from "@/hooks/use-courses";
import { useMemo } from "react";
import { Course } from "@/lib/api/types";
import { useStudyFilters } from "@/hooks/use-study-filters";

const LevelsPage = () => {
  const router = useRouter();
  const { data: levels, isLoading } = useLevels();
  const { data: courses } = useCourses();
  const { setLevel } = useStudyFilters();

  const coursesByLevel = useMemo(() => {
    if (!courses) return {} as Record<string, Course[]>;
    return courses.reduce((acc, course) => {
      const levelId = typeof course.level === "string" ? course.level : course.level?._id;
      if (!levelId) return acc;
      if (!acc[levelId]) acc[levelId] = [];
      acc[levelId].push(course);
      return acc;
    }, {} as Record<string, Course[]>);
  }, [courses]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Loading levels...
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Levels</h1>
          <p className="text-sm text-muted-foreground">
            Select your level to browse courses
          </p>
        </div>

        <div className="space-y-2">
          {(
            Array.isArray(levels)
              ? levels
              : (levels as any)?.data ?? []
          ).map((level) => (
            <div
              key={level._id}
              onClick={() => {
                setLevel(level._id);
                router.push(`/levels/${level._id}`);
              }}
              role="button"
              className="group min-h-[60px] px-4 py-3 w-full hover:bg-primary/5 flex items-center gap-3 text-muted-foreground font-medium rounded-md transition-colors cursor-pointer"
            >
              <IconRenderer iconName={level.icon || "GraduationCap"} className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-foreground">{level.name}</div>
                <div className="text-xs text-muted-foreground">
                  {(coursesByLevel[level._id] || []).length} courses
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelsPage;

