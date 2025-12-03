"use client";

import { studyHiveApi } from "@/lib/studyhive-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { IconRenderer } from "@/components/icon-renderer";

interface LevelPageProps {
  params: {
    levelId: string;
  };
}

const LevelPage = ({ params }: LevelPageProps) => {
  const router = useRouter();
  const level = studyHiveApi.levels.getById(params.levelId);
  const courses = studyHiveApi.levels.getCourses(params.levelId);

  if (!level) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Level not found</h2>
          <Button className="mt-4" onClick={() => router.push("/levels")}>
            Back to Levels
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/levels")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <IconRenderer iconName={level.icon} className="h-6 w-6 shrink-0" />
            <div>
              <h1 className="text-2xl font-semibold">{level.name}</h1>
              <p className="text-sm text-muted-foreground">{level.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => router.push(`/courses/${course._id}`)}
              role="button"
              className="group min-h-[60px] px-4 py-3 w-full hover:bg-primary/5 flex items-center gap-3 text-muted-foreground font-medium rounded-md transition-colors cursor-pointer"
            >
              <IconRenderer iconName={course.icon} className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-foreground">{course.title}</div>
                <div className="text-xs text-muted-foreground">
                  {course.code} • {course.creditUnits} credits
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No courses available for this level yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelPage;

