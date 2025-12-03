"use client";

import { studyHiveApi } from "@/lib/studyhive-data";
import { useRouter } from "next/navigation";
import { IconRenderer } from "@/components/icon-renderer";

const LevelsPage = () => {
  const router = useRouter();
  const levels = studyHiveApi.levels.getAll();

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
          {levels.map((level) => {
            const courses = studyHiveApi.levels.getCourses(level._id);
            return (
              <div
                key={level._id}
                onClick={() => router.push(`/levels/${level._id}`)}
                role="button"
                className="group min-h-[60px] px-4 py-3 w-full hover:bg-primary/5 flex items-center gap-3 text-muted-foreground font-medium rounded-md transition-colors cursor-pointer"
              >
                <IconRenderer iconName={level.icon} className="h-5 w-5 shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-foreground">{level.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {courses.length} courses
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelsPage;

